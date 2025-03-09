import { useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'
import '../styles/Accounts.css'

export default function Accounts() {
  const navigate = useNavigate()
  const { user, logOut } = useAuth()

  const handleLogout = async () => {
    try {
      await logOut()
      navigate("/")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleContinue = () => {
    navigate("/Home")
  }

  // Get the first letter of the email for the avatar
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : 'U'

  return (
    <div className="accounts-container">
      <div className="profile-card">
        <div className="card-header">
          <h2>Account Profile</h2>
        </div>
        <div className="card-content">
          <div className="avatar">
            {avatarLetter}
          </div>
          <div className="user-info">
            <p className="label">Signed in as</p>
            {user?.email}
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

