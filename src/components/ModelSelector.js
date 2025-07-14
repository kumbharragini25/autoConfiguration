import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';

export default function ModelSelector({ selectedCategory, selectedModel, onSelect, onNext, shouldLoad }) {
  const [selected, setSelected] = useState(selectedModel || '');
  const [allModels, setAllModels] = useState({});
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false); // ✅ persists across re-renders

  useEffect(() => {
    setSelected(selectedModel || '');
  }, [selectedModel]);

  useEffect(() => {
    setAllModels({});
    hasFetched.current = false; // ✅ reset when category changes
  }, [selectedCategory]);

  useEffect(() => {
    if (!shouldLoad || hasFetched.current) return;

    setLoading(true);
    fetch('https://mocki.io/v1/06ec4aff-17e0-4b4a-936e-a8090daeb184')
      .then((res) => res.json())
      .then((data) => {
        setAllModels(data);
        setLoading(false);
        hasFetched.current = true; // ✅ prevent future fetches
      })
      .catch((err) => {
        console.error('Error fetching model data:', err);
        setLoading(false);
      });
  }, [shouldLoad]);

  const models =
    selectedCategory && allModels[selectedCategory]
      ? allModels[selectedCategory]
      : [];

  const handleNext = () => {
    if (selected) {
      onSelect(selected);
      onNext();
    } else {
      alert('Please select a model');
    }
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <h6 className="text-muted mb-4">
        {selectedCategory
          ? `Models for ${selectedCategory}`
          : 'Please select a category first'}
      </h6>

      <Card
        className="mb-4"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0',
          maxWidth: '500px',
        }}
      >
        <Card.Body>
          {models.length > 0 ? (
            <Form>
              {models.map((model, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  name="model"
                  label={model}
                  value={model}
                  checked={selected === model}
                  onChange={() => setSelected(model)}
                  className="mb-3"
                />
              ))}
            </Form>
          ) : (
            <Alert variant="info">No models available for the selected category.</Alert>
          )}
        </Card.Body>
      </Card>

      <div className="text-center mt-4">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </>
  );
}
