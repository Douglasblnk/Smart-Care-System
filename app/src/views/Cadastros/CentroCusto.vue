<template>
    <div class="rectangle">
        <div class="containerWrapper"> 
            <div class="tituloTop">
                Cadastro
            </div>
            <div class="name-notification">
            <i class="fas fa-bell"></i>
            <span>|</span>
            <i class="fas fa-user"></i>  
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {

    },
    data(){
        return {
            
        }
    }
}
</script>


<style lang="scss">

.rectangle {
  width: 80%;
  height: 65px;
  padding: 20px;
  background: #FFFF;
  border-radius: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .containerWrapper{
    width:100% ;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  i {
    margin: 0px 20px;
    color: 	rgb(172, 172, 172);
    font-size: 20px;
  }
  hr {
    width: 0px;
    height: 100%;
    border: 1px solid black;
  }
}
.retangulo {
  width: 800px;
  height: 65px;
  padding: 20px;
  background: #FFFF;
  border-radius: 42px;
  div {
    display: flex;
    align-items: center;
  }

}
</style>