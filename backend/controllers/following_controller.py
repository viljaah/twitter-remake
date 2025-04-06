from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user_schema import User
from models.follow_schema import Follow

# @desc Get users that a specific user is following
# @route GET /users/following
def get_user_following(user_id: int, db: Session):
    """
    Get all users that a specific user is following
    
    :param user_id: ID of the user whose following list to retrieve
    :param db: SQLAlchemy database session
    :return: List of users the specified user is following with follow status
    :raises HTTPException: If user not found
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    # Get all users this user follows
    following = db.query(User).join(
        Follow, Follow.following_id == User.id
    ).filter(
        Follow.follower_id == user_id
    ).all()
    
    # Format the response
    following_list = []
    for followed_user in following:
        following_list.append({
            "id": followed_user.id,
            "username": followed_user.username,
            "display_name": followed_user.display_name,
            "bio": followed_user.bio,
            "is_following": True  # Always true since these are users being followed
        })
    
    return {
        "count": len(following_list),
        "following": following_list
    }

# @desc Follow a user
# @route POST /users/follow/{user_id}
def follow_user(current_user_id: int, user_to_follow_id: int, db: Session):
    """
    Allows a user to follow another user
    
    :param current_user_id: ID of the user performing the follow action
    :param user_to_follow_id: ID of the user to be followed
    :param db: SQLAlchemy database session
    :return: Success message if followed
    :raises HTTPException: If user not found or already following
    """
    # Check if trying to follow self
    if current_user_id == user_to_follow_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot follow yourself"
        )
    
    # Check if user to follow exists
    user_to_follow = db.query(User).filter(User.id == user_to_follow_id).first()
    if not user_to_follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_to_follow_id} not found"
        )
    
    # Check if already following
    existing_follow = db.query(Follow).filter(
        Follow.follower_id == current_user_id,
        Follow.following_id == user_to_follow_id
    ).first()
    
    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You are already following {user_to_follow.username}"
        )
    
    # Create new follow relationship
    new_follow = Follow(
        follower_id=current_user_id,
        following_id=user_to_follow_id
    )
    
    db.add(new_follow)
    db.commit()
    
    return {
        "success": True,
        "message": f"You are now following {user_to_follow.username}"
    }

# @desc Unfollow a user
# @route DELETE /users/follow/{user_id}
def unfollow_user(current_user_id: int, user_to_unfollow_id: int, db: Session):
    """
    Allows a user to unfollow another user
    
    :param current_user_id: ID of the user performing the unfollow action
    :param user_to_unfollow_id: ID of the user to be unfollowed
    :param db: SQLAlchemy database session
    :return: Success message if unfollowed
    :raises HTTPException: If user not found or not following
    """
    # Check if user to unfollow exists
    user_to_unfollow = db.query(User).filter(User.id == user_to_unfollow_id).first()
    if not user_to_unfollow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_to_unfollow_id} not found"
        )
    
    # Find the follow relationship
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user_id,
        Follow.following_id == user_to_unfollow_id
    ).first()
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You are not following {user_to_unfollow.username}"
        )
    
    # Remove the follow relationship
    db.delete(follow)
    db.commit()
    
    return {
        "success": True,
        "message": f"You have unfollowed {user_to_unfollow.username}"
    }


# In controllers/following_controller.py
def get_followers_count(user_id: int, db: Session):
    """
    Count the number of followers for a specific user
    
    :param user_id: ID of the user whose followers to count
    :param db: SQLAlchemy database session
    :return: Count of followers
    """
    count = db.query(Follow).filter(Follow.following_id == user_id).count()
    return {"count": count}

def get_following_count(user_id: int, db: Session):
    """
    Count the number of users a specific user is following
    
    :param user_id: ID of the user whose following to count
    :param db: SQLAlchemy database session
    :return: Count of following
    """
    count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    return {"count": count}