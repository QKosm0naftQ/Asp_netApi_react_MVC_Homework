import {Upload, Button, Modal} from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { UploadOutlined } from '@ant-design/icons';
import {useState} from "react";

const DragDropUpload = ({ fileList, setFileList }) => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const onUploadChange = ({ fileList: newList }) => {
        setFileList(newList.filter(f => f.status !== 'removed'));
    };

    const beforeUpload = () => false; // блокує автозавантаження

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(fileList);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        setFileList(items);
    };

    console.log("list files", fileList);

    return(
        <div>
            <Upload
                multiple
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={onUploadChange}
                showUploadList={false} // приховати стандартний список
            >
                <Button icon={<UploadOutlined />}>Вибрати файли</Button>
            </Upload>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="upload-list" direction={"horizontal"}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={"d-flex flex-wrap gap-2"}
                        >
                            {fileList.map((file, index) => (
                                <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                fileList={[file]}
                                                onRemove={() => {
                                                    const newFileList = fileList.filter(f => f.uid !== file.uid);
                                                    setFileList(newFileList);
                                                }}
                                                onPreview={(file) => {
                                                    if (!file.url && !file.preview) {
                                                        file.preview = URL.createObjectURL(file.originFileObj);
                                                    }

                                                    setPreviewImage(file.url || (file.preview));
                                                    setPreviewOpen(true);

                                                }}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>

        </div>
    )
}

export default DragDropUpload;