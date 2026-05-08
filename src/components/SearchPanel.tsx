import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  placeholder?: string;
}

function SearchPanel({ value, onChange, onSearch, placeholder = 'Buscar...' }: Props) {
  return (
    <form className="row g-2 align-items-center mb-4" onSubmit={onSearch}>
      <div className="col-md-9">
        <input
          className="form-control"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="col-md-3 d-grid">
        <button className="btn btn-warning fw-semibold" type="submit">Buscar</button>
      </div>
    </form>
  );
}

export default SearchPanel;
