import { Card, Flex, Skeleton, theme } from "antd";

export default function AuthLayoutLoading() {
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					backgroundColor: colorBgLayout,
				}}
			>
				<Card style={{ width: 500 }} hoverable>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection:"column",
							gap: "10px",
						}}
						className="mt-2"
					>
						<Skeleton.Avatar
							active
							shape="square"
							style={{ width: "55px", height: "55px" }}
						/>
					</div>

					<center>
						<Skeleton.Input active size="small" block className="w-full mt-2" />
					</center>

					<Skeleton.Input active size="small" className="mt-2" />
					<Skeleton.Input active  block className="mt-1.5" />

					<Skeleton.Input active size="small" className="mt-3" />
					<Skeleton.Input active  block className="mt-1.5" />

					<Flex justify="space-between" align="center" className="mt-5">
						<Skeleton.Input active size="small" className="w-[100px]" />
						<Skeleton.Input active size="small" className="w-[100px]" />
					</Flex>

					<Skeleton.Button size="large" block className="mt-3 mb-3" />
				</Card>
			</div>
		</>
	);
}
