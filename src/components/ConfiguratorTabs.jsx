import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import InfoCards from './InfoCards';

const isCheckboxGroup = (section, group) => {
  return (
    (section === "Technology" && group === "Connectivity") ||
    (section === "Packages" && group === "Other Add-ons")
  );
};

const exportSelectionsAsJson = (data) => {
  const filename = 'my-car-config.json';
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const categoryApiMap = {
  Sedan: "https://mocki.io/v1/6e268a18-401f-4bd0-89cb-5bebb3c8b932",
  Hatchback: "https://mocki.io/v1/a80a29e5-9c03-4a87-81ff-06863e3b4854",
  SUV: "https://mocki.io/v1/a3a40e23-f22e-47d8-9805-23b2c4d2fe13",
  CUV: "https://mocki.io/v1/2539e91c-cba2-4e93-9798-fbaa395ba400",
  Roadster: "https://mocki.io/v1/2539e91c-cba2-4e93-9798-fbaa395ba400",
  Supercar: "https://mocki.io/v1/a3a40e23-f22e-47d8-9805-23b2c4d2fe13",
  Wagon: "https://mocki.io/v1/a80a29e5-9c03-4a87-81ff-06863e3b4854",
  Pickup: "https://mocki.io/v1/6e268a18-401f-4bd0-89cb-5bebb3c8b932"
};

export default function ConfiguratorTabs({ selectedCategory }) {
  const [key, setKey] = useState("Exterior");
  const [selections, setSelections] = useState({});
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [canVisualize, setCanVisualize] = useState(false);
  const [videoApiLoading, setVideoApiLoading] = useState(false);
  const [videoApiError, setVideoApiError] = useState(null);

  useEffect(() => {
    const fetchSectionData = async () => {
      const apiUrl = categoryApiMap[selectedCategory];
      if (!apiUrl) {
        console.warn("No API mapped for selected category:", selectedCategory);
        setSectionData({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setSectionData(data);
        setSelections({});
        setKey("Exterior");
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch configuration data.");
        setSectionData({});
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [selectedCategory]);

  const handleSelection = (section, group, value, isCheckbox) => {
    setSelections(prev => {
      const current = prev[section]?.[group] || (isCheckbox ? [] : "");
      const updated = isCheckbox
        ? current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
        : value;

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [group]: updated
        }
      };
    });
  };

  const sectionKeys = Object.keys(sectionData);

  return (
    <>
      {loading && (
        <div className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading configuration...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && sectionKeys.length > 0 && (
        <>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            {sectionKeys.map((section) => (
              <Tab eventKey={section} title={section} key={section}>
                <Row className="pt-3">
                  {Object.entries(sectionData[section] || {}).map(([group, options]) => {
                    const isCheckbox = isCheckboxGroup(section, group);
                    const selected = selections[section]?.[group];

                    return (
                      <Col xs={12} sm={6} md={4} lg={3} key={group} className="mb-3">
                        <div className="config-group-card">
                          <h6 className="config-group-title">{group}</h6>
                          <Form>
                            {options.map((option, index) => {
                              const isSelected = isCheckbox
                                ? selected?.includes(option)
                                : selected === option;

                              return (
                                <div
                                  key={index}
                                  className={`option-box ${isSelected ? 'selected' : ''}`}
                                  onClick={() => handleSelection(section, group, option, isCheckbox)}
                                >
                                  <Form.Check
                                    type={isCheckbox ? "checkbox" : "radio"}
                                    name={`${section}-${group}`}
                                    label={option}
                                    checked={isSelected}
                                    onChange={() => handleSelection(section, group, option, isCheckbox)}
                                  />
                                </div>
                              );
                            })}
                          </Form>
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                <div className="text-center">
                  <Button
                    disabled={videoApiLoading}
                    onClick={() => {
                      const currentIndex = sectionKeys.indexOf(key);
                      const nextIndex = currentIndex + 1;

                      if (section === "Personalization") {
                        exportSelectionsAsJson(selections);
                        setVideoApiLoading(true);
                        setVideoApiError(null);

                        fetch('https://mocki.io/v1/b3b5f83b-8722-4ba7-96cd-0a9a4ef6f0c6') // replace with your dummy API
                          .then(res => {
                            if (!res.ok) throw new Error("Failed to fetch video permission");
                            return res.json();
                          })
                          .then(data => {
                            if (data.status === "success") {
                              setCanVisualize(true);
                              setVideoApiError(null);
                            } else {
                              setCanVisualize(false);
                              setVideoApiError("Video loading is not allowed at this time.");
                            }
                            setKey("Visualize");
                          })
                          .catch(err => {
                            console.error("Video API Error:", err);
                            setCanVisualize(false);
                            setVideoApiError("Unable to load video at this time.");
                            setKey("Visualize");
                          })
                          .finally(() => {
                            setVideoApiLoading(false);
                          });
                      } else if (nextIndex < sectionKeys.length) {
                        setKey(sectionKeys[nextIndex]);
                      }
                    }}
                  >
                    {videoApiLoading ? 'Loading...' : 'Next'}
                  </Button>
                </div>
              </Tab>
            ))}

            <Tab eventKey="Visualize" title="Visualize">
  <div className="text-center mt-4">
    {videoApiLoading && <Spinner animation="border" variant="primary" />}

    {!videoApiLoading && canVisualize && (
      <video
        autoPlay
        muted
        controls
        width="720"
        className="rounded shadow-sm"
      >
        <source src="/videos/Black.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )}

    {!videoApiLoading && !canVisualize && videoApiError && (
      <Alert variant="warning" className="mt-3">
        {videoApiError}
      </Alert>
    )}
  </div>
</Tab>

          </Tabs>

          <InfoCards currentTab={key} />
        </>
      )}
    </>
  );
}
