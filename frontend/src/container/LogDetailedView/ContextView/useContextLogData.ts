import { PANEL_TYPES } from 'constants/queryBuilder';
import {
	getOrderByTimestamp,
	INITIAL_PAGE_SIZE,
	LOGS_MORE_PAGE_SIZE,
} from 'container/LogsContextList/configs';
import { getRequestData } from 'container/LogsContextList/utils';
import { ORDERBY_FILTERS } from 'container/QueryBuilder/filters/OrderByFilter/config';
import { useGetExplorerQueryRange } from 'hooks/queryBuilder/useGetExplorerQueryRange';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SuccessResponse } from 'types/api';
import { ILog } from 'types/api/logs/log';
import { MetricRangePayloadProps } from 'types/api/metrics/getQueryRange';
import { Query, TagFilter } from 'types/api/queryBuilder/queryBuilderData';

export const useContextLogData = ({
	log,
	query,
	order,
	isEdit,
	filters,
}: {
	log: ILog;
	query: Query;
	order: string;
	isEdit: boolean;
	filters: TagFilter | null;
}): {
	logs: ILog[];
	handleShowNextLines: () => void;
	isError: boolean;
	isFetching: boolean;
} => {
	const [logs, setLogs] = useState<ILog[]>([]);
	const [page, setPage] = useState<number>(1);

	const firstLog = useMemo(() => logs[0], [logs]);
	const lastLog = useMemo(() => logs[logs.length - 1], [logs]);
	const orderByTimestamp = useMemo(() => getOrderByTimestamp(order), [order]);

	const logsMorePageSize = useMemo(() => (page - 1) * LOGS_MORE_PAGE_SIZE, [
		page,
	]);
	const pageSize = useMemo(
		() => (page <= 1 ? INITIAL_PAGE_SIZE : logsMorePageSize + INITIAL_PAGE_SIZE),
		[page, logsMorePageSize],
	);
	const isDisabledFetch = useMemo(() => logs.length < pageSize, [
		logs.length,
		pageSize,
	]);

	const currentStagedQueryData = useMemo(() => {
		if (!query || query.builder.queryData.length !== 1) return null;

		return query.builder.queryData[0];
	}, [query]);

	const initialLogsRequest = useMemo(
		() =>
			getRequestData({
				stagedQueryData: currentStagedQueryData,
				query,
				log,
				orderByTimestamp,
				page,
			}),
		[currentStagedQueryData, page, log, query, orderByTimestamp],
	);

	const [requestData, setRequestData] = useState<Query | null>(
		initialLogsRequest,
	);

	const handleSuccess = useCallback(
		(data: SuccessResponse<MetricRangePayloadProps, unknown>) => {
			const currentData = data?.payload.data.newResult.data.result || [];

			if (currentData.length > 0 && currentData[0].list) {
				const currentLogs: ILog[] = currentData[0].list.map((item) => ({
					...item.data,
					timestamp: item.timestamp,
				}));

				if (order === ORDERBY_FILTERS.ASC) {
					const reversedCurrentLogs = currentLogs.reverse();
					setLogs((prevLogs) => [...reversedCurrentLogs, ...prevLogs]);
				} else {
					setLogs((prevLogs) => [...prevLogs, ...currentLogs]);
				}
			}
		},
		[order],
	);

	const { isError, isFetching } = useGetExplorerQueryRange(
		requestData,
		PANEL_TYPES.LIST,
		{
			keepPreviousData: true,
			enabled: !!requestData,
			onSuccess: handleSuccess,
		},
	);

	const handleShowNextLines = useCallback(() => {
		if (isDisabledFetch) return;

		const log = order === ORDERBY_FILTERS.ASC ? firstLog : lastLog;

		const newRequestData = getRequestData({
			stagedQueryData: currentStagedQueryData,
			query,
			log,
			orderByTimestamp,
			page: page + 1,
			pageSize: LOGS_MORE_PAGE_SIZE,
		});

		setPage((prevPage) => prevPage + 1);
		setRequestData(newRequestData);
	}, [
		query,
		firstLog,
		lastLog,
		page,
		order,
		currentStagedQueryData,
		isDisabledFetch,
		orderByTimestamp,
	]);

	useEffect(() => {
		if (!isEdit) return;

		const newRequestData = getRequestData({
			stagedQueryData: currentStagedQueryData,
			query,
			log,
			orderByTimestamp,
			page: 1,
		});

		setPage(1);
		setLogs([]);
		setRequestData(newRequestData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	return {
		logs,
		handleShowNextLines,
		isError,
		isFetching,
	};
};
