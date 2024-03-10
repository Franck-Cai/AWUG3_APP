import { useEffect, useRef, useState } from "react";
import { supabase } from "../utils/clientSupabase";

export default function Chat({ session }) {
  const [messages, setMessages] = useState(null);
  const messageRef = useRef();

  const addMessage = async (newMessage) => {
    const res = await fetch(`${API_URL}/rest/v1/messages?apikey=${API_KEY}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ content: newMessage }),
    });
    console.log(res);
  };

  const addMessageSupabaseClient = async (newMessage) => {
    const newMessageObj = { content: newMessage, user_id: session.user.id };
    const { data, error } = await supabase
      .from("messages")
      .insert(newMessageObj)
      .select();
    error && console.error(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMessageSupabaseClient(messageRef.current.value);
  };

  // const getMessage = async () => {
  //   const res = await fetch(`${API_URL}/rest/v1/messages?apikey=${API_KEY}`);
  //   const data = await res.json();
  //   setMessages(data);
  // };

  const getMessageSupabaseClient = async () => {
    const { data, error } = await supabase.from("messages").select("*");
    !error ? setMessages(data) : console.error(error);
  };

  const handlePayload = (payload) => {
    setMessages((prev) => [...prev, payload.new]);
  };

  useEffect(() => {
    getMessageSupabaseClient();

    const dbChanel = supabase
      .channel("dbChannel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => handlePayload(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dbChanel);
    };
  }, []);

  return (
    <section className="chat-container">
      {`Hola, ${
        session.user.user_metadata.first_name
          ? session.user.user_metadata.first_name
          : session.user.email
      }`}
      <div className="messages-container">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                session.user.id === message.user_id ? "mine" : "others"
              }`}
            >
              {message.content}
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input ref={messageRef} />
        <button>Enviar</button>
      </form>
    </section>
  );
}
