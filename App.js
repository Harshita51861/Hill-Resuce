import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow, Polygon } from '@react-google-maps/api';
import { MapPin, Radio, Activity, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedRobot, setSelectedRobot] = useState(null);

  const mapCenter = { lat: 37.7749, lng: -122.4194 };

  // Zone boundaries
  const zoneBoundaries = [
    {
      name: 'Zone 1',
      color: '#3b82f6',
      paths: [
        { lat: 37.7849, lng: -122.4344 },
        { lat: 37.7849, lng: -122.4094 },
        { lat: 37.7699, lng: -122.4094 },
        { lat: 37.7699, lng: -122.4344 }
      ]
    },
    {
      name: 'Zone 2',
      color: '#10b981',
      paths: [
        { lat: 37.7699, lng: -122.4344 },
        { lat: 37.7699, lng: -122.4094 },
        { lat: 37.7549, lng: -122.4094 },
        { lat: 37.7549, lng: -122.4344 }
      ]
    },
    {
      name: 'Zone 3',
      color: '#f59e0b',
      paths: [
        { lat: 37.7549, lng: -122.4344 },
        { lat: 37.7549, lng: -122.4094 },
        { lat: 37.7399, lng: -122.4094 },
        { lat: 37.7399, lng: -122.4344 }
      ]
    }
  ];

  const [robots, setRobots] = useState([
    {
      id: 1,
      name: 'Robot 1',
      icon: '🚁',
      position: { lat: 37.7774, lng: -122.4219 },
      zone: 'Zone 1',
      battery: 100,
      status: 'exploring',
      color: '#3b82f6',
      path: [],
      survivorsFound: 0
    },
    {
      id: 2,
      name: 'Robot 2',
      icon: '🤖',
      position: { lat: 37.7624, lng: -122.4219 },
      zone: 'Zone 2',
      battery: 100,
      status: 'exploring',
      color: '#10b981',
      path: [],
      survivorsFound: 0
    },
    {
      id: 3,
      name: 'Robot 3',
      icon: '🚤',
      position: { lat: 37.7474, lng: -122.4219 },
      zone: 'Zone 3',
      battery: 100,
      status: 'exploring',
      color: '#f59e0b',
      path: [],
      survivorsFound: 0
    }
  ]);

  const survivors = [
    { id: 1, lat: 37.7729, lng: -122.4274 },
    { id: 2, lat: 37.7669, lng: -122.4214 },
    { id: 3, lat: 37.7519, lng: -122.4164 }
  ];

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 0.5);
      
      setRobots(prevRobots => 
        prevRobots.map(robot => {
          const newPosition = {
            lat: robot.position.lat + (Math.random() - 0.5) * 0.001,
            lng: robot.position.lng + (Math.random() - 0.5) * 0.001
          };
          
          const newPath = [...robot.path, newPosition].slice(-20);
          const newBattery = Math.max(0, robot.battery - 0.15);
          
          return {
            ...robot,
            position: newPosition,
            path: newPath,
            battery: newBattery,
            survivorsFound: robot.survivorsFound + (Math.random() < 0.015 ? 1 : 0)
          };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleReset = () => {
    setIsSimulating(false);
    setTimeElapsed(0);
    setRobots(robots.map((robot, idx) => ({
      ...robot,
      position: idx === 0 ? { lat: 37.7774, lng: -122.4219 } :
                idx === 1 ? { lat: 37.7624, lng: -122.4219 } :
                           { lat: 37.7474, lng: -122.4219 },
      battery: 100,
      path: [],
      survivorsFound: 0
    })));
  };

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    mapTypeId: 'satellite'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', padding: '24px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '32px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Radio size={48} color="#60a5fa" />
            3-Robot Coordinated Disaster Response System
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px', margin: 0 }}>
            Real-time area partitioning, predictive analysis, and coordinated rescue operations
          </p>
        </div>

        {/* Controls */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isSimulating ? (
                <button onClick={() => setIsSimulating(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                  <Play size={20} />
                  Start Simulation
                </button>
              ) : (
                <button onClick={() => setIsSimulating(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                  <Pause size={20} />
                  Pause
                </button>
              )}
              <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#475569', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.2)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
                <Activity size={20} color="#60a5fa" />
                <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>Time: {timeElapsed.toFixed(1)}s</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.2)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>Rescued: {robots.reduce((sum, r) => sum + r.survivorsFound, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          
          {/* Map */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={24} color="#60a5fa" />
              Live Map View
            </h2>
            
            <LoadScript googleMapsApiKey="">
              <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13.5} options={mapOptions}>
                
                {/* Zone Boundaries - DASHED */}
                {zoneBoundaries.map((zone, idx) => (
                  <Polygon
                    key={idx}
                    paths={zone.paths}
                    options={{
                      fillColor: zone.color,
                      fillOpacity: 0.08,
                      strokeColor: zone.color,
                      strokeOpacity: 0.9,
                      strokeWeight: 3,
                      icons: [{
                        icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
                        offset: '0',
                        repeat: '20px'
                      }]
                    }}
                  />
                ))}

                {/* Robots */}
                {robots.map(robot => (
                  <React.Fragment key={robot.id}>
                    <Marker
                      position={robot.position}
                      label={{ text: robot.icon, fontSize: '28px' }}
                      onClick={() => setSelectedRobot(robot)}
                    />
                    {robot.path.length > 1 && (
                      <Polyline path={robot.path} options={{ strokeColor: robot.color, strokeOpacity: 0.7, strokeWeight: 4 }} />
                    )}
                  </React.Fragment>
                ))}

                {/* Survivors */}
                {survivors.map(s => (
                  <Marker key={s.id} position={{ lat: s.lat, lng: s.lng }} label={{ text: '🆘', fontSize: '24px' }} />
                ))}

                {/* Info Window */}
                {selectedRobot && (
                  <InfoWindow position={selectedRobot.position} onCloseClick={() => setSelectedRobot(null)}>
                    <div style={{ padding: '12px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{selectedRobot.icon} {selectedRobot.name}</h3>
                      <p><strong>Zone:</strong> <span style={{ color: selectedRobot.color }}>{selectedRobot.zone}</span></p>
                      <p><strong>Battery:</strong> {selectedRobot.battery.toFixed(0)}%</p>
                      <p><strong>Rescued:</strong> {selectedRobot.survivorsFound}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Status Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {robots.map(robot => (
              <div key={robot.id} onClick={() => setSelectedRobot(robot)} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{robot.icon}</span>
                  {robot.name}
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '14px', marginBottom: '4px' }}>
                    <span>Zone:</span>
                    <span style={{ fontWeight: '600', color: robot.color }}>{robot.zone}</span>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '14px', marginBottom: '6px' }}>
                    <span>Battery:</span>
                    <span style={{ fontWeight: '600' }}>{robot.battery.toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${robot.battery}%`, height: '100%', background: robot.battery > 50 ? '#10b981' : robot.battery > 20 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s', borderRadius: '999px' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '14px' }}>
                  <span>Survivors Found:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>{robot.survivorsFound}</span>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Legend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '30px', height: '3px', borderTop: '3px dashed #3b82f6' }}></div>
                  <span>Zone Boundaries</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🚁🤖🚤</span>
                  <span>Robots</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🆘</span>
                  <span>Survivors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
