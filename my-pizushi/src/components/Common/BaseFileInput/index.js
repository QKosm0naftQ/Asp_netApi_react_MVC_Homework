
const BaseFileInput = ({field, label, onChange}) => {
    return (
        <>
            <div className="mb-3">
                <label htmlFor="imageFile" className="form-label">{label}</label>
                <input type="file"
                       className="form-control"
                       id={field}
                       name={field}
                       onChange={onChange}
                />
            </div>
        </>
    )
}

export default BaseFileInput;