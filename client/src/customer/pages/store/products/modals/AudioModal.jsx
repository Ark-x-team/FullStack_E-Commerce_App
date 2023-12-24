import { useEffect, useState } from "react";
import productStore from "../../../../../store/products/ProductStore";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "@nextui-org/react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";
import cartStore from "../../../../../store/cartStore";
import customerAuthStore from "../../../../../store/authentication/customerAuthStore";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AudioModal = () => {
  const { getProduct, productData } = productStore();
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  const navigate = useNavigate();
  const { addToCart } = cartStore();
  const handleAddToCart = (id, customerId) => {
    const token = Cookies.get("token");
    if (token) {
      addToCart(id, customerId);
    } else {
      navigate("/login");
    }
  };

  const { t } = useTranslation();

  return (
    <div className="h-fit">
      <span className="h-80 w-full relative hover:opacity-75 duration-200">
        <img
          src={`http://localhost:8081/uploads/${productData.product_files[0]}`}
          alt={productData.product_name}
          className="h-80 w-full object-cover object-center dark:brightness-[.8] "
        />
        <AudioPlayer
          onPlay={() => {
            setShowControls(true);
          }}
          onEnded={() => setShowControls(false)}
          src={`http://localhost:8081/uploads/${productData.product_files[1]}`}
          showJumpControls={false}
          autoPlayAfterSrcChange={false}
          autoPlay={false}
          showFilledVolume
          layout="stacked-reverse"
          customIcons={{
            play: <img src="/icons/play.svg" alt="play" className="w-8 h-8" />,
            pause: (
              <img src="/icons/pause.svg" alt="pause" className="w-8 h-8" />
            ),
            volume: (
              <img src="/icons/volume.svg" alt="Volume" className="w-4 h-4" />
            ),
            volumeMute: (
              <img
                src="/icons/volume-mute.svg"
                alt="Volume mute"
                className="w-4 h-4"
              />
            ),
          }}
          className={`audio-modal ${
            showControls ? "show-controls" : "hide-controls"
          }`}
        />
      </span>
      <div className="mt-2 p-3 md:p-4 lg:p-5 xl:px-8 flex justify-between">
        <h1 className=" text-lg md:text-xl lg:text-2xl capitalize text-primary dark:text-white">
          {productData.product_name}
        </h1>
        <h2 className="text-lg md:text-xl capitalize text-slate-700 dark:text-white">
          {t("price")}
          <span className="font-semibold"> {productData.price} MAD </span>
        </h2>
      </div>
      <div className="p-3 md:p-4 lg:p-5 xl:px-8 flex flex-col gap-2 md:gap-3 lg:gap-4">
        <h3 className="dark:text-light">{productData.short_description}</h3>
        <h3 className="dark:text-light">{productData.long_description}</h3>
      </div>
      <div className="p-3 md:p-4 lg:p-5 xl:px-8 flex justify-end">
        <Button
          onClick={() =>
            handleAddToCart(
              productData._id,
              customerAuthStore.getState().customerId
            )
          }
          color="primary"
          variant="flat"
          className="w-fit dark:text-primary capitalize"
          endContent={<AddRoundedIcon />}
        >
          {t("add")}
        </Button>
      </div>
    </div>
  );
};

export default AudioModal;
