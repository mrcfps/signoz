import './LogsExplorerTable.styles.scss';

import { initialQueriesMap } from 'constants/queryBuilder';
import LogsError from 'container/LogsError/LogsError';
import { QueryTable } from 'container/QueryTable';
import { useQueryBuilder } from 'hooks/queryBuilder/useQueryBuilder';
import { memo } from 'react';

import { LogsExplorerTableProps } from './LogsExplorerTable.interfaces';

function LogsExplorerTable({
	data,
	isLoading,
	isError,
}: LogsExplorerTableProps): JSX.Element {
	const { stagedQuery } = useQueryBuilder();

	if (isError) {
		return <LogsError />;
	}

	return (
		<QueryTable
			query={stagedQuery || initialQueriesMap.metrics}
			queryTableData={data}
			loading={isLoading}
			rootClassName="logs-table"
		/>
	);
}

export default memo(LogsExplorerTable);
