export default function ContactForm() {
  return (
    <form
      onSubmit={sendEmail}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <input
        type="text"
        name="from_name"
        placeholder="Meno"
        value={form.from_name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="from_email"
        placeholder="Email"
        value={form.from_email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Telefón / WhatsApp"
        value={form.phone}
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Tvoja správa..."
        value={form.message}
        onChange={handleChange}
        rows="4"
        required
      />

      <button type="submit">Odoslať</button>
    </form>
  );
}
