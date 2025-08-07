import classNames from "classnames";

const BaseFileInput = ({field, label, error, touched, onChange}) => {

    const isError = touched && error;

    return (
        <>
            <div className="mb-3">
                <label htmlFor="imageFile" className="form-label">{label}</label>
                <input type="file"
                       className={classNames("form-control", {
                           "is-invalid": isError
                       })}
                       id={field}
                       name={field}
                       onChange={onChange}
                />
                {isError && <div className="invalid-feedback">{error}</div>}
            </div>
        </>
    )
}

export default BaseFileInput;