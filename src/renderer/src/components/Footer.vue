<style scoped>
#footer-box {
  position: fixed;
  bottom: 0;
  width: 100%;
}
#footer-box {
  background-color: var(--sbgc);
  height: 13px;

  position: fixed;
  bottom: 0;
  width: 100%;
}

#footer-text-box {
  background-color: var(--sbgc);
  border-top-left-radius: var(--bdr);
  border-top-right-radius: var(--bdr);
  /* border-radius: 100px; */
  height: 40px;
  /* width: 100%; */
  position: fixed;
  bottom: 13px;
  left: 50%;
  transform: translateX(-50%);
}

#tb-text {
  background-color: var(--sbgc);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 40px;
  width: max-content;
  border-top-left-radius: var(--bdr);
  border-top-right-radius: var(--bdr);
  /* position: fixed; */
  /* bottom: 13px; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
}

#before-tb {
  background-color: transparent;
  position: absolute;
  bottom: 0%;
  left: -20px;
  /* border: 1px solid green; */
  height: 20px;
  width: 20px;
}

#before-tb img {
  height: 20px;
  width: 20px;
}


#after-tb {
  background-color: transparent;
  position: absolute;
  bottom: 0%;
  right: -20px;
  /* border: 1px solid green; */
  height: 20px;
  width: 20px;
}

#after-tb img {
  height: 25px;
  width: 25px;
}

/* ::before {
  content: "";
  position: absolute;

  background-color: transparent;
  bottom: -50px;
  height: 50px;
  width: 25px;
  border-top-left-radius: 25px;
  box-shadow: 0 -25px 0 0 #F66969;
} */
</style>

<script setup>
import LeftCurve from "../assets/img/left-curve.svg";
import RightCurve from "../assets/img/right-curve.svg";
</script>

<template>
  <div id="footer-box">
    <div id="footer-text-box">
      <div id="before-tb"><img :src="LeftCurve" /></div>
      <div id="tb-text">Hello Boss, how are you </div>
      <div id="after-tb"><img :src="RightCurve" /></div>
    </div>

    <div id="footer-bar"></div>
  </div>
</template>
<script setup></script>
