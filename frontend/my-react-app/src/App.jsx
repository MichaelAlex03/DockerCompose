import { useState, useEffect } from "react"


function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetch("http://ec2-98-81-133-119.compute-1.amazonaws.com:8000/test")
      const data = await result.json();
      console.log(data)
      console.log(data.data)
      setUsers(data.data)
    }
    fetchUsers();
  }, [])

  return (
      <div>
        {users.map((user) => (
          <p key={user.name}>{user.name}</p>
        ))}
      </div>
  )
}

export default App
