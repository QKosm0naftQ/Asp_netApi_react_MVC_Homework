import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const PasswordInput = ({ label, field, error, touched, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-3">
            <label className="form-label d-block">{label}</label>
            <div className="input-group">
                <input
                    type={showPassword ? "text" : "password"}
                    name={field}
                    className={`form-control ${touched && error ? "is-invalid" : ""}`}
                    value={value}
                    onChange={onChange}
                    placeholder="********"
                />
                <span
                    className="input-group-text bg-light cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                >
                    {showPassword ? <EyeOff className="text-secondary" size={20} /> : <Eye className="text-secondary" size={20} />}
                </span>
                {touched && error && <div className="invalid-feedback d-block">{error}</div>}
            </div>
        </div>
    );
};