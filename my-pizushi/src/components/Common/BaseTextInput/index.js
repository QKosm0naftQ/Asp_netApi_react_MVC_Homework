
const BaseTextInput = ({field, label, value, onChange}) => {
    return (
        <>
            <div className="mb-3">
                <label htmlFor={field} className="form-label">{label}</label>
                <input type="text"
                       className="form-control"
                       name={field}
                       id={field}
                       value={value}
                       onChange={onChange}
                />
            </div>
        </>
    )
}

export default BaseTextInput;