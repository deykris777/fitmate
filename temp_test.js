fetch('http://localhost:3000/api/generate-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '11111111-1111-1111-1111-111111111111' })
}).then(res => res.text()).then(text => console.log('RESPONSE:', text)).catch(console.error);
