$(document).ready(function() {
  var maxX 	= 17;
  var maxY 	= 17;
  var snake = false;
  var item 	= false;
  var score = 0;
  var stage;
  var timer = 400;
  var currentKey = 37;
  var key_left 	= 37,
      key_up 		= 38,  
      key_right = 39,
      key_down 	= 40;
  
  $(document).keydown(function(e) {
	  if(e.keyCode % 2 == currentKey % 2) {
			return false;
	  }
	  
    currentKey = e.keyCode;
  });
  
  game_start();
  
  function game_start() {
    stage_start(timer);
    create_snake();
    create_item();
  }

  function score_up(score_i) {
    if(score_i == '') score_i = 0;
    
    score = score_i;  
      $('#score_box').find('span').text(score);
  }

  /* 인터벌 실행 */
  function stage_start(timer_i) {
    timer = timer_i;
    stage = setInterval(function() {
      move_snake(currentKey);
      
    }, timer);
    
  }
  
  /* 인터벌 종료 */
  function stage_stop() {
    clearInterval(stage);
    
  }
  
  /* 새로고침 */
  function game_over() {
    stage_stop();
    alert('Game Over');
    location.reload();
    
  }
  
  /* 첫 1회 실행 */
  function create_snake()  { // 처음 스네이크 배열 값 생성 함수
    var dir_snake_x = 8; // 스네이크 고정 td data속성의 좌표 값
    var dir_snake_y = 9; // 스네이크 고정 tr data속성의 좌표 값
        
    $('table').find('.snake_head').removeAttr('class');
    $('table').find('.snake').removeAttr('class');
    $('table').find('tr[data-y="'+dir_snake_y+'"]').find('td[data-x="'+dir_snake_x+'"]').addClass('snake_head'); // tr 과 td 고정 data 좌표값을 넣어 스네이크 머리 클래스 생성
    $('table').find('tr[data-y="'+dir_snake_y+'"]').find('td[data-x="'+(dir_snake_x+ 1) +'"]').addClass('snake'); // tr 과 td 고정 data에 1을 더한 좌표값을 넣어 스네이크 몸 클래스 생성
    $('table').find('tr[data-y="'+dir_snake_y+'"]').find('td[data-x="'+(dir_snake_x+ 2) +'"]').addClass('snake'); // tr 과 td 고정 data에 2을 더한 좌표값을 넣어 스네이크 몸 클래스 생성
    
    snake = [
      [dir_snake_x, dir_snake_y],
      [dir_snake_x+1, dir_snake_y],
      [dir_snake_x+2, dir_snake_y],
    ];
    
  }
  
  /* 첫 1회 실행 */
  function create_item() {
    var item_x = 11;
    var item_y = 4;
    
    $('table').find('tr[data-y="'+item_y+'"]').find('td[data-x="'+item_x+'"]').attr('id', 'item'); // tr , td 고정 data 좌표값을 넣어 해당 td에 아이디 값 생성  
    
    item = [item_x, item_y];
  }

  
  function move_snake(keyCode) { // keyup의 key code 값 (= dir) 키 입력 받을 때마다 실행됨
    var new_snake = false; // false
    var x = 0;
    var y = 0;
    
    switch(keyCode) {
	    case key_left 	: --x; break;
	    case key_up 		: --y; break;
	    case key_right 	: ++x; break;
      case key_down 	: ++y; break;
      default : return true;
    }
    
    currentKey = keyCode;

    
    /*
	   * 1. 벽 충돌체크
	   * 2. 몸통 충돌체크
	   * 3. 아이템 먹으면 몸통 배열 추가
	   * 4. 먹지 않아도 다음 칸 배열 할당
	   */
    get_after_dir_snake(x, y);
    
    /* 아이템 생성 */
    drawNew_item(snake);
    
    /* 스네이크 생성 */
    drawSnake(snake);
    
  }
  
  function drawSnake(new_snake) { // 새로운 스네이크 배열을 받아서 새로운 스네이크를 그리는 함수
    $('table').find('.snake_head').removeAttr('class'); // 스네이크 머리 클래스 삭제
    $('table').find('.snake').removeAttr('class'); 			// 스네이크 몸통 클래스 삭제
    
    for(var i=0; i<new_snake.length; ++i) {
      var td = $('table').find('tr[data-y="'+new_snake[i][1]+'"]').find('td[data-x="'+new_snake[i][0]+'"]');
      
      if(i==0) { // i의 값이 0 일 때
        td.addClass('snake_head');
        
      } else {
        td.addClass('snake');
      
      }
      
    }
    
  }

  function drawNew_item(new_snake) {
    if(new_snake[0][0] == item[0] && new_snake[0][1] == item[1]) { // 아이템을 먹었을 때
      var item_x = Math.ceil(Math.random() * maxX); // 렌덤 
      var item_y = Math.ceil(Math.random() * maxY); // 렌덤

      /* 스네이크 몸통에서 아이템이 뜬다면 */
      if($('table').find('tr[data-y="'+item_y+'"]').find('td[data-x="'+item_x+'"]').hasClass('snake')) {
        drawNew_item(new_snake); // 함수 호출
      }
      item = [item_x, item_y];
      
      $('table').find('#item').removeAttr('id');
      $('table').find('tr[data-y="'+item_y+'"]').find('td[data-x="'+item_x+'"]').attr('id', 'item');

      function add() { // 아이템을 먹고 다시 그릴 때 마다 실행
        score_up(++score); // score 점수 올리는 함수 호출
        stage_start(--timer);
      }
      add();
    }

  }


  function get_after_dir_snake(change_x, change_y) {
    var dir_snake_x_i = (snake[0][0]*1) + (change_x*1);
    var dir_snake_y_i = (snake[0][1]*1) + (change_y*1);
    
    // 벽 밖으로 나가지 못하게 하기
    if(
    	dir_snake_x_i == -1 		|| 
    	dir_snake_x_i == maxX+1 || 
    	dir_snake_y_i == -1 		|| 
    	dir_snake_y_i ==  maxY+1
    ) {
      game_over();
      
    }
    
    // 앞에 꼬리 있으면 게임오버
    if($('tr[data-y="'+dir_snake_y_i+'"]').find('td[data-x="'+dir_snake_x_i+'"]').hasClass('snake')) {
      game_over();
      
    }
    
    if(dir_snake_x_i == item[0] && dir_snake_y_i == item[1]){
      snake.unshift([dir_snake_x_i, dir_snake_y_i]);
    } else { // 값이 같지 않다면 (아이템을 먹지 않았다면)
      snake.unshift([dir_snake_x_i, dir_snake_y_i]);
      snake.pop();
    }
    
  }

  
  
});
  