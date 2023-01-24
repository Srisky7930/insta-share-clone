import {Component} from 'react'
import {BsHeart} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import './index.css'

class SearchPostCard extends Component {
  state = {
    isLiked: false,
    likedStatus: false,
    counter: 0,
    commentShow: false,
    commentInput: '',
    commentList: [],
  }

  renderPostLikeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {userPostDetails} = this.props
    const {postId} = userPostDetails

    const {likedStatus} = this.state
    console.log(likedStatus)

    const requestedBody = {
      like_status: likedStatus,
    }

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(requestedBody),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedPostId = await response.json()
      console.log(fetchedPostId)
    }
  }

  onclickLikeIncrement = () => {
    this.setState({isLiked: true})
    this.setState(preState => ({counter: preState.counter + 1}))
    this.setState({likedStatus: true}, this.renderPostLikeStatus)
  }

  onClickLikeDecrement = () => {
    this.setState({isLiked: false})
    this.setState(preState => ({counter: preState.counter - 1}))
    this.setState({likedStatus: false}, this.renderPostLikeStatus)
  }

  onCommentToggle = () => {
    this.setState(preState => ({commentShow: !preState.commentShow}))
  }

  onChangeCommentInput = event => {
    this.setState({commentInput: event.target.value})
  }

  onAddComment = event => {
    event.preventDefault()
    const {commentInput} = this.state
    const newComment = {
      comment: commentInput,
    }

    this.setState(preState => ({
      commentList: [...preState.commentList, newComment],

      commentInput: '',
    }))
  }

  render() {
    const {userPostDetails} = this.props
    const {
      profilePicture,
      userId,
      userName,
      createdAt,
      likesCount,
      userComments,

      imageUrl,
      caption,
    } = userPostDetails

    const {isLiked} = this.state

    return (
      <li className="user-Post-Container">
        <div className="user-Post-content">
          <div className="user-profile-container">
            <img
              className="user-profile-img"
              src={profilePicture}
              alt="post author profile"
            />
            <Link to={`/users/${userId}`} className="nav-link">
              <h1 className="user-names">{userName}</h1>
            </Link>
          </div>
          <img src={imageUrl} alt="post" className="post-image" />
          <div className="like-share-detail-container">
            <div className="reaction-container">
              {isLiked ? (
                <button
                  type="button"
                  className="like-icon-button"
                  onClick={this.onClickLikeDecrement}
                >
                  <FcLike size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="like-icon-button"
                  onClick={this.onclickLikeIncrement}
                >
                  <BsHeart size={15} />
                </button>
              )}
              <button
                type="button"
                className="like-icon-button"
                onClick={this.onCommentToggle}
              >
                <FaRegComment />
              </button>
              <button
                type="button"
                className="like-icon-button"
                onClick={this.onCommentToggle}
              >
                <BiShareAlt />
              </button>
            </div>
            <p className="likes-count">
              {isLiked ? likesCount + 1 : likesCount} likes
            </p>

            <p className="likes-count">{caption}</p>

            <div className="post-details">
              <ul className="comment-item">
                {userComments.map(eachItem => (
                  <li key={eachItem.user_id} className="comment-container">
                    <p className="comment">
                      <span className="comment-name">{eachItem.user_name}</span>
                      {eachItem.comment}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="comment">{createdAt}</p>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

export default SearchPostCard
