import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function MQTTDisplay() {
  const [messages, setMessages] = useState('');
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // const mqttClient = mqtt.connect('ws://localhost:9001'); // mosquitto
    const mqttClient = mqtt.connect('ws://localhost:8083/mqtt'); // emqx

    mqttClient.on('connect', () => {
      console.log('Connected');
      mqttClient.subscribe('angular');
    });

    mqttClient.on('message', (topic, payload) => {
      setMessages(payload.toString());
    });

    setClient(mqttClient);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h1 className="text-xl font-bold">MQTT Messages</h1>
      <p className="mt-2">{messages}</p>
    </div>
  )
}
