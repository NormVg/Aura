<style scoped>
#footer-box{

  position: fixed;
  bottom: 0;
  width: 100%;

}
#footer-box{
  background-color: var(--sbgc);
  height: 13px;

  position: fixed;
  bottom: 0;
  width: 100%;

}


#footer-text-box{
  background-color: var(--sbgc);

  height: 50px;
  /* width: 100%; */
  position: fixed;
  bottom: 13px;
  left: 50%;
  transform: translateX(-50%);
}

#tb-text{
  background-color: var(--sbgc);
  border: 1px green solid;
  height: 50px;
  width: max-content;
  /* position: fixed; */
  /* bottom: 13px; */
  /* left: 50%; */
  /* transform: translateX(-50%); */
}

#before-tb{
  /* background-color: red; */

  background-color: transparent;

  height: 25px;
  width: 25px;
  position: absolute;

  bottom: 10px;

  left: -35px;
  border-bottom-right-radius: 10px;

  box-shadow: 10px 10px 0 0 #F66969;
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

<template>
  <div id="footer-box">

    <div id="footer-text-box">

      <div id="before-tb"></div>
      <div id="tb-text">Hello Boss</div>
      <div id="after-tb"></div>

    </div>

    <div id="footer-bar">
    </div>
  </div>
</template>
<script setup>
</script>
