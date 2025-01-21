import { useState } from "react";
import ColumnSelector, { getColumnKey } from "../../../components/common/ColumnSelector";
import { CustomTable } from "../../../components/common/Table";
import { CustomColumnType } from "../../../types/TableType";
import { DeleteOutlined } from "@ant-design/icons";
import ButtonToggleView from "../../../components/common/ButtonToggleView";

interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
}
export default function Profile() {
	const [view , setView] = useState<"table"|"card">("table")
	const columns: CustomColumnType<DataType>[] = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			lock: true, // column นี้จะไม่สามารถซ่อนได้
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			sorter: (a: DataType, b: DataType) => a.age - b.age,
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
	];

	const data: DataType[] = [
		{
			key: "1",
			name: "John Brown 1",
			age: 32,
			address: "New York 1",
		},
		{
			key: "2",
			name: "John Brown 2",
			age: 33,
			address: "New York 2",
		},
		{
			key: "3",
			name: "John Brown 3",
			age: 34,
			address: "New York 3",
		},
	];

    const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(getColumnKey)
  );

  const handleColumnToggle = (columnKey: string, checked: boolean, isLocked: boolean) => {
    if (isLocked) return;
    
    if (checked) {
      setVisibleColumns([...visibleColumns, columnKey]);
    } else {
      setVisibleColumns(visibleColumns.filter((key) => key !== columnKey));
    }
  };

	const handleDelete = (selectedKeys: React.Key[]) => {
  console.log('Delete:', selectedKeys);
};

const handleExport = (selectedKeys: React.Key[]) => {
  console.log('Export:', selectedKeys);
};

const toggleView = ()=> {
	setView((prev)=>prev=="card"?"table":"card")
}

	return (
    <div>
			<ButtonToggleView view={view} setToggleView={toggleView}/>
      <div className="flex justify-end mb-4">
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={handleColumnToggle}
        />
      </div>

      
      {view=="table"?<CustomTable
        columns={columns}
        dataSource={data}
        visibleColumns={visibleColumns}
        enableColumnDrag={true}
				operations={[
					{ label: 'Delete', onClick: handleDelete, type: 'dashed', size:"small", icon:<DeleteOutlined/> },
					{ label: 'Export', onClick: handleExport, type: 'primary' ,size:"small"},
				]}
				enableRowPin={false}
      />:
			(<>
			{data.map((d:any)=>(
				<div key={d.key}>{d.name}</div>
			))}
			</>)
			}
    </div>
	);
}
