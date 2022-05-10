// https://kr.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuekr-demo'
var todoStorage = {
    fetch: function() {
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

var app = new Vue({
    el: '#app',
    data: {
        todos: [],
        options: [
            { value: -1, label: 'All' },
            { value: 0, label: 'Active' },
            { value: 1, label: 'Completed' },
        ],
        //선택되어 있는 옵션의 value를 저장하기 위함
        //초기값 -1 (전체0
        current: -1,
    },

    created() {
        //인스턴스 생성시 자동으로 fetch() 기능 실행
        this.todos = todoStorage.fetch()
    },

    methods: {
        //todo list add
        doAdd: function (event, index) {
            //ref로 이름붙어 있는 요소 참조
            var comment = this.$refs.comment;
            if (!comment.value.length) { return } //입력이 없으면 return

            //{새 id, 내용, 상태}
            //todo list에 추가하기
            //작업상태 state => 디폴트로 0(작업중) 설정
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })

            //추가 후 입력부분 초기화
            comment.value = "";
        },

        //상태 변경 처리
        doChangeState: function (todo) {
            todo.state = todo.state ? 0 : 1
        },

        //todo제거 처리
        doRemove: function (todo) {
            var index = this.todos.indexOf(todo)
            this.todos.splice(index, 1)
        },

        //todo 전체제거 
        doAllRemove: function () {
            this.todos.splice(0, this.todos.length);  
        },
    },

    watch: {
        //옵션을 사용하는 경우 객체 형식으로 지정
        todos: {
            //배개 변수로는 속성의 변경 후 값이 들어옴 
            handler: function (todos) {
                todoStorage.save(todos)
            },
            //deep 옵션으로 내부 데이터까지 감시
            deep: true
        }
    },

    computed: {
        computedTodos: function() {
            //current가 -1이면 전체, 이외에는 state 기반 필터링
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },

        //키를 기반으로 쉽게 볼수 있도록 변환 0:'작업중', 1:'완료', -1:'전체'
        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
    }
})