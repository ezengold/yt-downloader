import React, { useState } from 'react';
import { Checkbox, Input, Item, MoreButton, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useDebounce, useToggle } from 'hooks';
import { useApp } from 'providers/app';

import { IoTrashOutline } from 'react-icons/io5';
import { CgMoreO } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { Dropdown } from 'react-bootstrap';

const Aside = () => {
  const { colors } = useTheme();

  const { loadingItems, currentItem, itemsList, loadItems, viewDetailsOf } =
    useApp();

  const [hasLoaded, setHasLoaded] = useState(false);

  const [search, setSearch] = useState('');

  useDebounce(
    () => {
      loadItems(search, !hasLoaded);
      setHasLoaded(true);
    },
    500,
    [search]
  );

  const [selecting, setSelecting] = useToggle(false);

  return (
    <View background={colors?.card} className="ezen-aside">
      <View className="w-100 d-flex align-items-center justify-content-between my-2 p-4">
        <Text color={colors?.principal} size={20} font={AppFonts.PACIFICO}>
          yt-Downloader
        </Text>
        <div className="d-flex align-items-end justify-content-end">
          <IoTrashOutline
            color={colors?.red}
            size={20}
            className="cursor-pointer me-3"
          />
          <MoreButton color={colors?.principal} />
        </div>
      </View>
      <div className="px-3 d-flex flex-column">
        <Input
          containerClassName="mt-3"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
          iconRight={
            <AiOutlineSearch size={17} color={colors?.text} className="mx-2" />
          }
        />
        <div className="my-4">
          {selecting && (
            <Checkbox
              size={16}
              color={colors?.principal}
              style={{ marginLeft: '15px' }}
              checked={selecting}
              onChange={setSelecting}
            />
          )}
        </div>
        {loadingItems ? (
          <Text className="w-100 text-center my-5">Loading...</Text>
        ) : Array.isArray(itemsList) && itemsList.length > 0 ? (
          itemsList.map((item) => (
            <Item
              key={item.id}
              item={item}
              isActive={item.id === currentItem?.id}
              isSelectable={selecting}
              onClick={() => viewDetailsOf(item)}
            />
          ))
        ) : (
          <Text className="w-100 text-center my-5">No data available</Text>
        )}
      </div>
    </View>
  );
};

export default Aside;
