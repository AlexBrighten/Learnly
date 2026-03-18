export async function executeAsync(taskName, data) {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  
  try {
    // Fire and forget fetch to our local worker
    fetch(`${baseUrl}/api/worker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskName, data }),
    }).catch((err) => {
      console.error(`Error in background task ${taskName}:`, err);
    });
    
    console.log(`Triggered local background task: ${taskName}`);
  } catch (err) {
    console.error(`Failed to trigger background task ${taskName}:`, err);
  }
}
