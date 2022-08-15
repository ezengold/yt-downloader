import React, { useState } from 'react';
import { Input, Item, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { IoTrashOutline } from 'react-icons/io5';
import { CgMoreO } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsCheckSquareFill } from 'react-icons/bs';
import { DOWNLOAD_ITEMS_LIST } from 'dataset';

const Aside = () => {
  const { colors } = useTheme();

  const [search, setSearch] = useState('');

  const [currentItemId, setCurrentItemId] = useState('');

  const [data, setData] = useState(DOWNLOAD_ITEMS_LIST);

  const viewDetailsOf = (itemId: string) => {
    setCurrentItemId((old) => (old === itemId ? '' : itemId));
  };

  return (
    <View background={colors.card} className="ezen-aside">
      <View className="w-100 d-flex align-items-center justify-content-between my-2 p-4">
        <Text color={colors.principal} size={20} font={AppFonts.PACIFICO}>
          yt-Downloader
        </Text>
        <div className="d-flex align-items-center justify-content-end">
          <IoTrashOutline
            color={colors.red}
            size={20}
            className="cursor-pointer"
          />
          <CgMoreO
            color={colors.principal}
            size={20}
            className="ms-3 cursor-pointer"
          />
        </div>
      </View>
      <div className="px-3 d-flex flex-column">
        <Input
          containerClassName="mt-3"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
          iconRight={
            <AiOutlineSearch size={17} color={colors.text} className="mx-2" />
          }
        />
        <BsCheckSquareFill
          className="my-4"
          size={16}
          color={colors.principal}
          style={{ marginLeft: '15px' }}
        />
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <Item
              key={item.id}
              item={item}
              isActive={item.id === currentItemId}
              onClick={() => viewDetailsOf(item.id)}
            />
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </div>
    </View>
  );
};

export default Aside;
