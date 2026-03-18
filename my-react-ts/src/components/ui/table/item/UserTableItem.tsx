import React from 'react';
import { TableCell, TableRow } from "../index.tsx";
import { type IAdminUserItem } from "../../../../services/types.ts";
import { APP_ENV } from "../../../../env";
import { Button, Space, Tag } from "antd";
import { Link } from "react-router";
import { CloseCircleFilled, EditOutlined } from "@ant-design/icons";

interface UserTableItemProps {
  user: IAdminUserItem;
  onEdit: () => void;
}

const UserTableItem: React.FC<UserTableItemProps> = ({ user, onEdit }) => {
  // Безпечне форматування дати
  const formatDate = (dateString?: string) => {
    if (!dateString) return <span className="text-gray-400 italic text-xs">—</span>;
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? <span className="text-gray-400 italic text-xs">—</span>
      : date.toLocaleDateString();
  };

  return (
    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* 1. Id */}
      <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
        {user.id}
      </TableCell>

      {/* 2. Full Name */}
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {user.fullName}
      </TableCell>

      {/* 3. Email */}
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {user.email}
      </TableCell>

      {/* 4. Created */}
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {formatDate(user.dateCreated)}
      </TableCell>

      {/* 5. Roles */}
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Tag color="blue" key={role} className="mr-0 text-[10px]">
              {role}
            </Tag>
          ))}
        </div>
      </TableCell>

      {/* 6. Login types */}
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap gap-1">
          {user.loginTypes && user.loginTypes.length > 0 ? (
            user.loginTypes.map((type) => (
              <Tag color="green" key={type} className="mr-0 text-[10px]">
                {type}
              </Tag>
            ))
          ) : (
            <Tag className="text-[10px]">Default</Tag>
          )}
        </div>
      </TableCell>

      {/* 7. Image */}
      <TableCell className="py-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 shadow-sm">
          <img
            src={user.image ? `${APP_ENV.IMAGES_100_URL}${user.image}` : '/images/user/default.png'}
            alt={user.fullName}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'; }}
          />
        </div>
      </TableCell>

      {/* 8. Action */}
      <TableCell className="py-3">
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={onEdit}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          />
          <Button
            size="small"
            danger
            icon={<CloseCircleFilled />}
          />
        </Space>
      </TableCell>
    </TableRow>
  );
};

export default UserTableItem;
