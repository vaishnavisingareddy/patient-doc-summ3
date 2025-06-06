export const saveAnalysisToDB = async (result: any) => {
  const res = await fetch('http://localhost:5000/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  return await res.json();
};
