import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
            <div className="bg-white p-4 rounded shadow" style={{ width: "100%", maxWidth: 400 }}>
                <p className="mb-4">{message}</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={onCancel}>
                        Скасувати
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Так
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;