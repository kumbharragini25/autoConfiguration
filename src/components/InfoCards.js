import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaClock, FaDollarSign } from 'react-icons/fa';

export default function InfoCards({ currentTab }) {
  const isVisualize = currentTab === 'Visualize';

  return (
    <Row className="mt-4">
      <Col md={6}>
        <Card className="p-3 bg-light">
          <Card.Title><FaClock /> Delivery Timeline</Card.Title>
          <Card.Text>
            {isVisualize ? 'August 2025 (3 months from order date)' : 'Awaiting Configuration Solve'}
          </Card.Text>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="p-3 bg-light">
          <Card.Title><FaDollarSign /> Pricing Information</Card.Title>
          <Card.Text>
            {isVisualize ? '$125,000 (including taxes)' : 'Awaiting Configuration Solve'}
          </Card.Text>
        </Card>
      </Col>
    </Row>
  );
}
