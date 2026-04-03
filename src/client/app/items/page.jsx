import React, { useState } from 'react';

export default function ItemsPage({ items }) {
  const [input, setInput] = useState('');
  const [previewItem, setPreviewItem] = useState('');

  return (
    <section>
      <h2>Items</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Preview an item name" />
      <button onClick={() => setPreviewItem(input)}>Preview</button>
      {previewItem && <p>Previewing: {previewItem}</p>}

      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </section>
  );
}
