import React, { useState } from 'react';
import { Checkbox, Input, Item, MoreButton, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useDebounce, useToggle } from 'hooks';
import { useApp } from 'providers/app';
import { useStore } from 'providers/store';

import { IoTrashOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { FILTER, MODALS, ORDER, RUNNING_STATUS } from 'configs';
import styled from 'styled-components';
import { BsPlusCircle } from 'react-icons/bs';

const Aside = ({ overlayed }) => {
  const { colors } = useTheme();

  const {
    loadItems,
    viewDetailsOf,
    currentItem,
    itemsList,
    deleteDownloadItems,
  } = useStore();

  const { presentModal } = useApp();

  /**
   * Handle auto load items and search with filters
   */
  const [search, setSearch] = useState('');

  const [filter, setFilter] = useState(FILTER.DATE);

  const [filterOrder, setFilterOrder] = useState(ORDER.DESC);

  const toggleFilter = (clickedFilter = '') => {
    if (![FILTER.DATE, FILTER.NAME, FILTER.SIZE].includes(clickedFilter))
      return;

    if (filter === clickedFilter) {
      // change order
      setFilterOrder((old) => (old === ORDER.DESC ? ORDER.ASC : ORDER.DESC));
    } else {
      // set clicked filter
      setFilter(clickedFilter);
      setFilterOrder(ORDER.DESC);
    }
  };

  useDebounce(
    () => {
      loadItems(search, filter, filterOrder);
    },
    500,
    [search, filter, filterOrder]
  );

  /**
   * Handle selecting items for deletion
   */
  const [selecting, setSelecting] = useToggle(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelection = () => {
    setSelecting(!selecting);
    setSelectedIds([]);
  };

  const handleSelectItem = (itemId = '', status = false) => {
    if (status) {
      // status is true if in selected id array
      setSelectedIds((old) => old.filter((id) => id !== itemId));
    } else {
      setSelectedIds((old) => [...old, itemId]);
    }
  };

  const handleToogleSelectAll = (status = false) => {
    if (status) {
      // status is true if next move is to select all
      setSelectedIds(
        itemsList
          ?.filter((el) => el?.status !== RUNNING_STATUS)
          .map((el) => el?.id)
      );
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteItems = () => {
    presentModal({
      modalKey: MODALS.CONFIRM_DELETE,
      modalProps: {
        title: 'Warning !',
        message: 'Do you really want to delete the selected items ?',
      },
      onHide: (status) => {
        if (status === true) deleteDownloadItems(selectedIds);
        handleSelection();
        setSelectedIds([]);
      },
    });
  };

  /**
   * Add new download item
   */
  const handleAddItem = () => {
    presentModal({
      modalKey: MODALS.NEW_DOWNLOAD,
    });
  };

  return (
    <View
      background={colors?.card}
      className={`ezen-aside ${overlayed ? 'overlayed' : ''}`}
    >
      <View className="w-100 d-flex align-items-center justify-content-between my-2 p-4">
        <Text color={colors?.principal} size={20} font={AppFonts.PACIFICO}>
          yt-Downloader
        </Text>
        <div className="d-flex align-items-end justify-content-end">
          <BsPlusCircle
            color={colors?.principal}
            size={20}
            className="cursor-pointer me-3"
            onClick={handleAddItem}
          />
          {selecting && selectedIds.length > 0 && (
            <IoTrashOutline
              color={colors?.red}
              size={20}
              className="cursor-pointer me-3"
              onClick={handleDeleteItems}
            />
          )}
          <MoreButton
            selecting={selecting}
            onToggleSelect={handleSelection}
            color={colors?.principal}
            activeFilter={filter}
            activeOrder={filterOrder}
            onClickFilter={toggleFilter}
          />
        </div>
      </View>
      <div className="px-3 d-flex flex-column w-100">
        <Input
          containerClassName="mt-3"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
          iconRight={
            <AiOutlineSearch
              size={17}
              color={search ? colors?.principal : colors?.text}
              className="mx-2 cursor-pointer"
            />
          }
        />
        <View height="30px" className="my-3 w-100 d-flex align-items-center">
          {selecting && (
            <Checkbox
              size={16}
              color={colors?.principal}
              style={{ marginLeft: '15px' }}
              checked={
                selectedIds.length ===
                itemsList?.filter((el) => el?.status !== RUNNING_STATUS).length
              }
              onChange={handleToogleSelectAll}
            />
          )}
        </View>
      </div>
      <ListWrapper
        className="px-3 pb-5 w-100 d-flex flex-column"
        indicatorForeground={colors.text}
        indicatorBackground={colors.background}
      >
        {Array.isArray(itemsList) && itemsList.length > 0 ? (
          itemsList.map((item) => {
            const isChecked = selectedIds.includes(item?.id);

            return (
              <Item
                key={item.id}
                item={item}
                isActive={item.id === currentItem?.id}
                isSelected={isChecked}
                isSelectable={selecting && item.status !== RUNNING_STATUS}
                onClick={() => viewDetailsOf(item)}
                onSelect={() => handleSelectItem(item?.id, isChecked)}
              />
            );
          })
        ) : (
          <Text className="w-100 text-center my-5">No data available</Text>
        )}
      </ListWrapper>
    </View>
  );
};

export default Aside;

const ListWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 250px);
  overflow: auto;
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    border: 0px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px
      ${({ indicatorBackground }) => indicatorBackground || '#ddd'};
    border-radius: 15px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${({ indicatorForeground }) =>
      indicatorForeground || '#aaaaaa'}55;
    border-radius: 15px;
  }
  ::-webkit-scrollbar-corner {
    display: none;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;
