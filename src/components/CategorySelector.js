import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { FaCarSide, FaTruckPickup } from 'react-icons/fa';
import sedanImg from '../../src/assets/icons/sedan.png';
import hatchbackImg from '../../src/assets/icons/hatchback.png';
import suvImg from '../../src/assets/icons/suv.png';
import cuvImg from '../../src/assets/icons/cuv.png';
import roadsterImg from '../../src/assets/icons/roadster.png';
import supercarImg from '../../src/assets/icons/supercar.png';
import wagonImg from '../../src/assets/icons/wagon.png';
import pickupImg from '../../src/assets/icons/pickup.png';

// // Icon mapping for known category names
// const iconMap = {
//   Sedan: <FaCarSide />,
//   Hatchback: <FaCarSide />,
//   SUV: <FaCarSide />,
//   CUV: <FaCarSide />,
//   Roadster: <FaCarSide />,
//   Supercar: <FaCarSide />,
//   Wagon: <FaCarSide />,
//   Pickup: <FaTruckPickup />
// };

// Icon mapping for known category names
const iconMap = {
  Sedan: sedanImg,
  Hatchback: hatchbackImg,
  SUV: suvImg,
  CUV: cuvImg,
  Roadster: roadsterImg,
  Supercar: supercarImg,
  Wagon: wagonImg,
  Pickup: pickupImg
};

export default function CategorySelector({ onSelect, onNext, selected }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mocki.io/v1/5e07a1e1-b24f-47b4-9965-97d6b71322f6')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Unexpected response format', data);
          setCategories([]); // fallback to empty array
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <h6 className="text-muted mb-4">Select Your Automobile Category</h6>
      <Row>
        {categories.map((cat, idx) => (
          <Col key={idx} md={3} sm={6} xs={12} className="mb-4">
            <div
              className="category-widget"
              style={{
                backgroundColor: selected === cat.name ? '#eaf4fd' : '#ffffff',
                color: selected === cat.name ? '#154c79' : '#333',
                border: selected === cat.name ? '2px solid #6daee6' : '2px solid #dee2e6',
                fontWeight: selected === cat.name ? '600' : 'normal',
                cursor: 'pointer',
                padding: '20px 15px',
                minHeight: '160px',
                fontSize: '15px',
                boxShadow: selected === cat.name
                  ? '0 4px 12px rgba(109, 174, 230, 0.25)'
                  : '0 1px 4px rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                transition: 'all 0.3s ease-in-out',
              }}
              onClick={() => onSelect(cat.name)}
            >
              <div
                className="mb-3"
                style={{
                  fontSize: '50px',
                  color: selected === cat.name ? '#007FFF' : '#bcd4e9',
                  transition: 'color 0.3s ease-in-out',
                }}
              >
                <div className="mb-2">
                  <img
                    src={iconMap[cat.name] || '../assets/icons/sedan.png'}
                    alt={cat.name}

                    style={{ width: '150px', height: '100px' }}
                  />
                </div>
                {/* {iconMap[cat.name] || <FaCarSide />} */}
              </div>
              {cat.name}
            </div>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button onClick={onNext}>Next</Button>
      </div>
    </>
  );
}
