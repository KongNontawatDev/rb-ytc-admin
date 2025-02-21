import {
	Skeleton,
	Space,
  Card,
} from "antd";

const DashboardLayoutLoading = () => {
	return (
		<div className="p-2 pt-5 max-w-full">
			{/* ส่วนหัวของหน้า */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<div className="flex flex-col ">
					<div className="flex overflow-x-auto mb-3 pb-1">
						<Skeleton.Button
							active
							size="small"
							className="mr-2"
							style={{ width: 80 }}
						/>
						<Skeleton.Button
							active
							size="small"
							className="mr-2"
							style={{ width: 130 }}
						/>
					</div>
					<Skeleton.Input active size="small" style={{ width: 200 }} />
				</div>
				<div className="flex mt-2 gap-3">
					<Space>
						<Skeleton.Button active />
						<Skeleton.Button active />
						<Skeleton.Button active />
					</Space>
					<Skeleton.Button active style={{ width: 130 }} />
				</div>
			</div>

			{/* แถบเมนูสถานะ */}
			<Card>
				{/* ส่วนค้นหาและกรอง */}
				<div className="flex flex-col md:flex-row mb-4 gap-2">
					<div className="flex-grow md:max-w-lg">
						<Skeleton.Input active style={{ width: 400 }} />
					</div>
				</div>

				{/* ตารางแสดงข้อมูล */}
					<Skeleton className="mt-3"/>
					<Skeleton className="mt-3"/>
					<Skeleton className="mt-3"/>
					<Skeleton className="mt-3"/>
					<Skeleton className="mt-3"/>

			</Card>
		</div>
	);
};

export default DashboardLayoutLoading;
