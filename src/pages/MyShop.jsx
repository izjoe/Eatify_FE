

const MyShop = () => {
  return (
    <div style={{marginTop: "100px", padding: "20px 8vw"}}>
      <h1>Seller Dashboard</h1>
      <hr style={{margin: "20px 0"}}/>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px"}}>
          <div style={{border: "1px solid #tomato", padding: "30px", borderRadius: "8px", textAlign: "center"}}>
              <h3>Add New Food</h3>
              <p>Upload your dishes here</p>
              <button style={{marginTop: "10px", padding: "10px 20px", background: "tomato", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>Go to Add</button>
          </div>
          <div style={{border: "1px solid #tomato", padding: "30px", borderRadius: "8px", textAlign: "center"}}>
              <h3>Manage Orders</h3>
              <p>Check incoming orders</p>
              <button style={{marginTop: "10px", padding: "10px 20px", background: "tomato", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>View Orders</button>
          </div>
      </div>
    </div>
  )
}

export default MyShop