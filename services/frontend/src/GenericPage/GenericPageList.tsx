import {List} from '@mui/material';
import {useEffect, useState} from 'react';
import {
  GenericPageListType,
  GenericPageListItemType,
} from '../types/typesGenericPage';
import {GenericPageListItem} from './GenericPageListItem';

const GenericPageList = ({
  listData,
  filterValue,
}: {
  listData: GenericPageListType;
  filterValue: string;
}) => {
  const [filteredData, setFilteredData] = useState<GenericPageListItemType[]>(
    [],
  );

  useEffect(() => {
    if (filterValue) {
      const temp = listData.data.filter(({id, primaryText}) => {
        return (
          primaryText.includes(filterValue) || String(id).includes(filterValue)
        );
      });
      setFilteredData(temp);
    } else {
      setFilteredData(listData.data);
    }
  }, [listData, filterValue]);
  return (
    <List>
      {filteredData.map((itemData, i) => (
        <GenericPageListItem
          key={i}
          data={itemData}
          avatarType={listData.avatarType}
        />
      ))}
    </List>
  );
};

export default GenericPageList;
