import classNames from "classnames";

const BaseTextInput = ({field, label, value, error, touched, onChange}) => {

    const isError = touched && error;

    return (
        <>
            <div className="mb-3">
                <label htmlFor={field} className="form-label">{label}</label>
                <input type="text"
                       className={classNames("form-control", {
                           "is-invalid": isError
                       })}
                       name={field}
                       id={field}
                       value={value}
                       onChange={onChange}
                />
                {isError && <div className="invalid-feedback">{error}</div>}
            </div>
        </>
    )
}

export default BaseTextInput;
