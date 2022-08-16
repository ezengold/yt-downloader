import React from 'react';
import { Text, View } from 'components';
import { useTheme } from 'providers/theme';
import { useApp } from 'providers/app';

const EmptyContent = () => {
  const { colors, toggleScheme } = useTheme();
  const { presentModal } = useApp();

  return (
    <View className="ezen-content d-flex flex-column align-items-center justify-content-center">
      <View
        height={40}
        background={colors.principal}
        color="white"
        radius="3px"
        className="px-4 mb-5 d-flex align-items-center justify-content-center cursor-pointer"
        onClick={() =>
          presentModal({
            Component: DummyModal,
            onHide: (...args) => console.log(args),
          })
        }
      >
        Toggle
      </View>
      Click an item to view it details
    </View>
  );
};

const DummyModal = () => (
  <View className="ezen-modal p-5 rounded-20" width="400px">
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus rem
      facilis quaerat sed quibusdam neque quidem exercitationem, voluptate omnis
      libero voluptatibus, ratione impedit doloremque est tempore esse nulla
      totam laborum.
    </Text>
  </View>
);

export default EmptyContent;
