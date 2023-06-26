const successfullVerifyTemplate = (payload) =>{
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>User Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
        
        .container {
          max-width: 500px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          color: #333;
        }
        
        p {
          margin-bottom: 20px;
        }
        
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
        }
        
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Dear ${payload.email}</h1>
        <p>Your account has been successfully verified.</p>
        <p>You can now access all the features and functionalities of our platform.</p>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
        <p>Thank you for joining us!</p>
        <a class="btn" href="http://192.168.15.201:3000/login">Go to Website</a>
      </div>
    </body>
    </html>`
    
}

module.exports = successfullVerifyTemplate;