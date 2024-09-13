import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function MQTTDisplay() {
  const [messages, setMessages] = useState<{ [key: string]: string } | null>(null);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // const mqttClient = mqtt.connect('ws://localhost:9001'); // mosquitto
    const mqttClient = mqtt.connect('ws://localhost:8083/mqtt'); // emqx

    mqttClient.on('connect', () => {
      console.log('Connected');
      mqttClient.subscribe('omni/agv/control');
    });

    mqttClient.on('message', (topic, payload) => {
      setMessages(prevMessages => {
        return {
          ...prevMessages,
          [topic]: payload.toString()
        };
      })
    });

    setClient(mqttClient);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  function handlePublish() {
    if (client) {
      const payload = {
        type: 'move',
        direction: 1,
        magnitude: 10
      }
      client.publish('omni/agv/control', JSON.stringify(payload));
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h1 className="text-xl font-bold">MQTT Messages</h1>
      <button
        onClick={handlePublish}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >Forward 10 meter</button>

      {messages && Object.keys(messages).map((topic, index) => (
        <div key={index} className="flex justify-between">
          <div className="text-gray-600">{topic}</div>
          <div className="text-gray-800">{messages[topic]}</div>
        </div>
      ))}
    </div>
  )
}
