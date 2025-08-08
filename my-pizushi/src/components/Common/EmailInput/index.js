import { Mail } from "lucide-react";

export const EmailInput = ({ label, field, error, touched, value, onChange }) => {
    return (
        <div className="mb-3">
            <label className="form-label d-block">{label}</label>
            <div className="input-group">
                <span className="input-group-text bg-light">
                    <Mail className="text-secondary" size={20} />
                </span>
                <input
                    type="email"
                    name={field}
                    className={`form-control ${touched && error ? "is-invalid" : ""}`}
                    value={value}
                    onChange={onChange}
                    placeholder="name@example.com"
                />
                {touched && error && <div className="invalid-feedback d-block">{error}</div>}
            </div>
        </div>
    );
};