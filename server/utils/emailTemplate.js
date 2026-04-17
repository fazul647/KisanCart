const emailTemplate = (content) => {
    return `
    <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      
      <div style="background: #198754; color: white; padding: 15px; text-align: center;">
        <h1>🌾 KisanCart</h1>
      </div>
  
      <div style="padding: 20px;">
        ${content}
      </div>
  
      <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px;">
        <p>© 2026 KisanCart | Connecting Farmers & Buyers</p>
      </div>
  
    </div>
    `;
  };
  
  module.exports = emailTemplate;