import './GridCardLayout.styles.scss';

import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Tooltip, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import cx from 'classnames';
import { SOMETHING_WENT_WRONG } from 'constants/api';
import { QueryParams } from 'constants/query';
import { PANEL_TYPES } from 'constants/queryBuilder';
import { themeColors } from 'constants/theme';
import { useUpdateDashboard } from 'hooks/dashboard/useUpdateDashboard';
import useComponentPermission from 'hooks/useComponentPermission';
import { useIsDarkMode } from 'hooks/useDarkMode';
import { useNotifications } from 'hooks/useNotifications';
import useUrlQuery from 'hooks/useUrlQuery';
import history from 'lib/history';
import { defaultTo } from 'lodash-es';
import isEqual from 'lodash-es/isEqual';
import { FullscreenIcon, MoveDown, MoveUp, Settings } from 'lucide-react';
import { useDashboard } from 'providers/Dashboard/Dashboard';
import { sortLayout } from 'providers/Dashboard/util';
import { useCallback, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Layout } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UpdateTimeInterval } from 'store/actions';
import { AppState } from 'store/reducers';
import { Dashboard, Widgets } from 'types/api/dashboard/getAll';
import AppReducer from 'types/reducer/app';
import { ROLES, USER_ROLES } from 'types/roles';
import { ComponentTypes } from 'utils/permission';
import { v4 as uuid } from 'uuid';

import { EditMenuAction, ViewMenuAction } from './config';
import GridCard from './GridCard';
import {
	Button,
	ButtonContainer,
	Card,
	CardContainer,
	ReactGridLayout,
} from './styles';
import { GraphLayoutProps } from './types';
import { removeUndefinedValuesFromLayout } from './utils';

function GraphLayout({ onAddPanelHandler }: GraphLayoutProps): JSX.Element {
	const {
		selectedDashboard,
		layouts,
		setLayouts,
		panelMap,
		setPanelMap,
		setSelectedDashboard,
		isDashboardLocked,
	} = useDashboard();
	const { data } = selectedDashboard || {};
	const handle = useFullScreenHandle();
	const { pathname } = useLocation();
	const dispatch = useDispatch();

	const { widgets, variables } = data || {};

	const { t } = useTranslation(['dashboard']);

	const { featureResponse, role, user } = useSelector<AppState, AppReducer>(
		(state) => state.app,
	);

	const isDarkMode = useIsDarkMode();

	const [dashboardLayout, setDashboardLayout] = useState<Layout[]>([]);

	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

	const [currentSelectRowId, setCurrentSelectRowId] = useState<string | null>(
		null,
	);

	const [form] = useForm<{
		title: string;
	}>();

	const updateDashboardMutation = useUpdateDashboard();

	const { notifications } = useNotifications();
	const urlQuery = useUrlQuery();

	let permissions: ComponentTypes[] = ['save_layout', 'add_panel'];

	if (isDashboardLocked) {
		permissions = ['edit_locked_dashboard', 'add_panel_locked_dashboard'];
	}

	const userRole: ROLES | null =
		selectedDashboard?.created_by === user?.email
			? (USER_ROLES.AUTHOR as ROLES)
			: role;

	const [saveLayoutPermission, addPanelPermission] = useComponentPermission(
		permissions,
		userRole,
	);

	useEffect(() => {
		setDashboardLayout(sortLayout(layouts));
	}, [layouts]);

	const onSaveHandler = (): void => {
		if (!selectedDashboard) return;

		const updatedDashboard: Dashboard = {
			...selectedDashboard,
			data: {
				...selectedDashboard.data,
				panelMap: { ...panelMap },
				layout: dashboardLayout.filter((e) => e.i !== PANEL_TYPES.EMPTY_WIDGET),
			},
			uuid: selectedDashboard.uuid,
		};

		updateDashboardMutation.mutate(updatedDashboard, {
			onSuccess: (updatedDashboard) => {
				if (updatedDashboard.payload) {
					if (updatedDashboard.payload.data.layout)
						setLayouts(sortLayout(updatedDashboard.payload.data.layout));
					setSelectedDashboard(updatedDashboard.payload);
				}

				featureResponse.refetch();
			},
			onError: () => {
				notifications.error({
					message: SOMETHING_WENT_WRONG,
				});
			},
		});
	};

	const widgetActions = !isDashboardLocked
		? [...ViewMenuAction, ...EditMenuAction]
		: [...ViewMenuAction];

	const handleLayoutChange = (layout: Layout[]): void => {
		const filterLayout = removeUndefinedValuesFromLayout(layout);
		const filterDashboardLayout = removeUndefinedValuesFromLayout(
			dashboardLayout,
		);
		if (!isEqual(filterLayout, filterDashboardLayout)) {
			// need to calculate the panel map here
			const updatedLayout = sortLayout(layout);
			// let prevRowIdx = '';
			// let tempWidgets: Layout[] = [];
			// const currentPanelMap = { ...panelMap };
			// for (let i = 0; i < updatedLayout.length; i++) {
			// 	if (currentPanelMap[updatedLayout[i].i]) {
			// 		if (prevRowIdx === '') {
			// 			prevRowIdx = updatedLayout[i].i;
			// 		} else {
			// 			currentPanelMap[prevRowIdx] = {
			// 				...currentPanelMap[prevRowIdx],
			// 				widgets: tempWidgets,
			// 			};
			// 			tempWidgets = [];
			// 			prevRowIdx = updatedLayout[i].i;
			// 		}
			// 	} else if (prevRowIdx !== '') {
			// 		tempWidgets.push(updatedLayout[i]);
			// 	}
			// }
			// if (prevRowIdx !== '') {
			// 	currentPanelMap[prevRowIdx] = {
			// 		...currentPanelMap[prevRowIdx],
			// 		widgets: tempWidgets,
			// 	};
			// }
			// setPanelMap(currentPanelMap);
			setDashboardLayout(updatedLayout);
		}
	};

	const onDragSelect = useCallback(
		(start: number, end: number) => {
			const startTimestamp = Math.trunc(start);
			const endTimestamp = Math.trunc(end);

			urlQuery.set(QueryParams.startTime, startTimestamp.toString());
			urlQuery.set(QueryParams.endTime, endTimestamp.toString());
			const generatedUrl = `${pathname}?${urlQuery.toString()}`;
			history.replace(generatedUrl);

			if (startTimestamp !== endTimestamp) {
				dispatch(UpdateTimeInterval('custom', [startTimestamp, endTimestamp]));
			}
		},
		[dispatch, pathname, urlQuery],
	);

	useEffect(() => {
		if (
			dashboardLayout &&
			Array.isArray(dashboardLayout) &&
			dashboardLayout.length > 0 &&
			!isEqual(layouts, dashboardLayout) &&
			!isDashboardLocked &&
			saveLayoutPermission &&
			!updateDashboardMutation.isLoading
		) {
			onSaveHandler();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dashboardLayout]);

	function handleAddRow(): void {
		// /**
		//  * handleAddRow takes care of generating the panelMap for the newly added row
		//  * by populating the widgets under the current row and deleting them from the
		//  * dashboard layout
		//  */
		if (!selectedDashboard) return;
		const id = uuid();

		const newRowWidgetMap: { widgets: Layout[]; collapsed: boolean } = {
			widgets: [],
			collapsed: false,
		};
		const currentRowIdx = 0;
		for (let j = currentRowIdx; j < dashboardLayout.length; j++) {
			if (!panelMap[dashboardLayout[j].i]) {
				newRowWidgetMap.widgets.push(dashboardLayout[j]);
			} else {
				break;
			}
		}

		const updatedDashboard: Dashboard = {
			...selectedDashboard,
			data: {
				...selectedDashboard.data,
				layout: [
					{
						i: id,
						w: 12,
						minW: 12,
						minH: 0.3,
						maxH: 0.3,
						x: 0,
						h: 0.3,
						y: 0,
					},
					...dashboardLayout.filter((e) => e.i !== PANEL_TYPES.EMPTY_WIDGET),
				],
				panelMap: { ...panelMap, [id]: newRowWidgetMap },
				widgets: [
					...(selectedDashboard.data.widgets || []),
					{
						id,
						title: 'Sample Row',
						description: '',
						panelTypes: PANEL_TYPES.ROW,
					},
				],
			},
			uuid: selectedDashboard.uuid,
		};

		updateDashboardMutation.mutate(updatedDashboard, {
			// eslint-disable-next-line sonarjs/no-identical-functions
			onSuccess: (updatedDashboard) => {
				if (updatedDashboard.payload) {
					if (updatedDashboard.payload.data.layout)
						setLayouts(sortLayout(updatedDashboard.payload.data.layout));
					setSelectedDashboard(updatedDashboard.payload);
					setPanelMap(updatedDashboard.payload.data.panelMap || {});
				}

				featureResponse.refetch();
			},
			// eslint-disable-next-line sonarjs/no-identical-functions
			onError: () => {
				notifications.error({
					message: SOMETHING_WENT_WRONG,
				});
			},
		});
	}

	const handleRowSettingsClick = (id: string): void => {
		setIsSettingsModalOpen(true);
		setCurrentSelectRowId(id);
	};

	console.log(panelMap);

	const onSettingsModalSubmit = (): void => {
		// handle update of the title here
		console.log(form.getFieldValue('title'));
		form.setFieldValue('title', '');
		setIsSettingsModalOpen(false);
	};

	const handleRowCollapse = (id: string): void => {
		const rowProperties = { ...panelMap[id] };
		if (rowProperties.collapsed === true) {
			rowProperties.collapsed = false;
			const widgetsInsideTheRow = rowProperties.widgets;
			let maxY = 0;
			widgetsInsideTheRow.forEach((w) => {
				maxY = Math.max(maxY, w.y);
			});
			const idxCurrentRow = dashboardLayout.findIndex((w) => w.i === id);

			let updatedDashboardLayout = [...dashboardLayout];
			for (let j = idxCurrentRow + 1; j < dashboardLayout.length; j++) {
				updatedDashboardLayout[j].y += maxY;
			}
			updatedDashboardLayout = [...updatedDashboardLayout, ...widgetsInsideTheRow];
			setPanelMap((prev) => ({
				...prev,
				[id]: {
					...rowProperties,
				},
			}));
			setDashboardLayout(sortLayout(updatedDashboardLayout));
		} else {
			rowProperties.collapsed = true;
			const widgetsInsideTheRow = rowProperties.widgets;
			const updatedDashboardLayout = [...dashboardLayout].filter(
				(widget) => !widgetsInsideTheRow.some((w: Layout) => w.i === widget.i),
			);
			// eslint-disable-next-line sonarjs/no-identical-functions
			setPanelMap((prev) => ({
				...prev,
				[id]: {
					...rowProperties,
				},
			}));
			setDashboardLayout(sortLayout(updatedDashboardLayout));
		}
	};
	return (
		<>
			<ButtonContainer>
				<Tooltip title="Open in Full Screen">
					<Button
						className="periscope-btn"
						loading={updateDashboardMutation.isLoading}
						onClick={handle.enter}
						icon={<FullscreenIcon size={16} />}
						disabled={updateDashboardMutation.isLoading}
					/>
				</Tooltip>

				{!isDashboardLocked && addPanelPermission && (
					<Button
						className="periscope-btn"
						onClick={onAddPanelHandler}
						icon={<PlusOutlined />}
						data-testid="add-panel"
					>
						{t('dashboard:add_panel')}
					</Button>
				)}
				{!isDashboardLocked && addPanelPermission && (
					<Button
						className="periscope-btn"
						onClick={(): void => handleAddRow()}
						icon={<PlusOutlined />}
						data-testid="add-row"
					>
						{t('dashboard:add_row')}
					</Button>
				)}
			</ButtonContainer>

			<FullScreen handle={handle} className="fullscreen-grid-container">
				<ReactGridLayout
					cols={12}
					rowHeight={100}
					autoSize
					width={100}
					useCSSTransforms
					isDraggable={!isDashboardLocked && addPanelPermission}
					isDroppable={!isDashboardLocked && addPanelPermission}
					isResizable={!isDashboardLocked && addPanelPermission}
					allowOverlap={false}
					onLayoutChange={handleLayoutChange}
					draggableHandle=".drag-handle"
					layout={dashboardLayout}
					style={{ backgroundColor: isDarkMode ? '' : themeColors.snowWhite }}
				>
					{dashboardLayout.map((layout) => {
						const { i: id } = layout;
						const currentWidget = (widgets || [])?.find((e) => e.id === id);

						if (currentWidget?.panelTypes === PANEL_TYPES.ROW) {
							const rowWidgetProperties = panelMap[id] || {};
							return (
								<CardContainer
									className={isDashboardLocked ? '' : 'enable-resize'}
									isDarkMode={isDarkMode}
									key={id}
									data-grid={JSON.stringify(currentWidget)}
								>
									<div
										className={cx(
											'row-panel',
											rowWidgetProperties.collapsed ? '.drag-handle' : '',
										)}
									>
										<Button
											icon={
												rowWidgetProperties.collapsed ? (
													<MoveDown size={14} />
												) : (
													<MoveUp size={14} />
												)
											}
											type="text"
											onClick={(): void => handleRowCollapse(id)}
										/>
										<Typography.Text>Row Title</Typography.Text>
										<Button
											icon={<Settings size={14} />}
											type="text"
											onClick={(): void => handleRowSettingsClick(id)}
										/>
									</div>
								</CardContainer>
							);
						}

						return (
							<CardContainer
								className={isDashboardLocked ? '' : 'enable-resize'}
								isDarkMode={isDarkMode}
								key={id}
								data-grid={JSON.stringify(currentWidget)}
							>
								<Card
									className="grid-item"
									$panelType={currentWidget?.panelTypes || PANEL_TYPES.TIME_SERIES}
								>
									<GridCard
										widget={(currentWidget as Widgets) || ({ id, query: {} } as Widgets)}
										headerMenuList={widgetActions}
										variables={variables}
										version={selectedDashboard?.data?.version}
										onDragSelect={onDragSelect}
									/>
								</Card>
							</CardContainer>
						);
					})}
				</ReactGridLayout>
				<Modal
					open={isSettingsModalOpen}
					title="Row Options"
					destroyOnClose
					footer={null}
					onCancel={(): void => {
						setIsSettingsModalOpen(false);
						setCurrentSelectRowId(null);
					}}
				>
					<Form form={form} onFinish={onSettingsModalSubmit} requiredMark>
						<Form.Item required name={['title']}>
							<Input
								placeholder="Enter row name here..."
								defaultValue={defaultTo(
									widgets?.find((widget) => widget.id === currentSelectRowId)
										?.title as string,
									'Sample Title',
								)}
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Apply Changes
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</FullScreen>
		</>
	);
}

export default GraphLayout;
