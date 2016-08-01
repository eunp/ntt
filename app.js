var app = angular.module("myTodoList", []);

app.controller("myCtrl", function($scope, $http) {

  $scope.all_todos = [
    {
    "Todo": "Feed Cats",
    "Priority": 1,
    "Completed": false,
    "Target": "2016-08-01"
    },
    {
    "Todo": "Do Laundry",
    "Priority": 0,
    "Completed": false,
    "Target": "2016-08-15"
    },
    {
    "Todo": "Schedule 2nd phone interview",
    "Priority": 2,
    "Completed": false,
    "Target": "2016-08-08"
    },
    {
    "Todo": "Phone Interview with NTT",
    "Priority": 2,
    "Completed": true,
    "Target": "2016-07-20",
    "CompletedDate": "2016-07-21"
    },
    {
    "Todo": "Programming challenge",
    "Priority": 2,
    "Completed": true,
    "Target": "2016-07-31",
    "CompletedDate": "2016-07-31"
    }
  ];

  $scope.todos = $scope.all_todos.filter( function(curr) {
    return !curr.Completed;
  });
  $scope.done_todos = $scope.all_todos.filter( function(curr) {
    return curr.Completed;
  });

  $scope.selected = {};

  $scope.PRI = { 0: 'Low', 1: 'Med', 2: 'High' };
  $scope.options = [
    {
     name: "Low",
     value: 0
    }, {
     name: "Med",
     value: 1 
    }, {
     name: "High",
     value: 2 
    }
  ];
  $scope.priority = $scope.options[1];
  $scope.target = new Date();

  $scope.sortPriority = function() {
    $scope.errormsg = "";
    $scope.pri_order = $scope.pri_order || 'desc';

    if ($scope.pri_order === 'desc') {    
      $scope.pri_order = 'asc';
      $scope.todos.sort( function(a,b) {
        if (a.Priority > b.Priorty) {
          return -1;
        } else if (a.Priority < b.Priority) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      $scope.pri_order = 'desc';
      $scope.todos.sort( function(a,b) {
        if (a.Priority < b.Priorty) {
          return -1;
        } else if (a.Priority > b.Priority) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  $scope.sortTarget = function(d) {
    $scope.errormsg = "";
    $scope.tgt_order = $scope.tgt_order || 'asc';

    if ($scope.tgt_order === 'asc') {    
      $scope.tgt_order = 'desc';
      $scope.todos.sort( function(a,b) {
        if (a.Target < b.Target) {
          return -1;
        } else if (a.Target > b.Target) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      $scope.tgt_order = 'asc';
      $scope.todos.sort( function(a,b) {
        if (a.Target > b.Target) {
          return -1;
        } else if (a.Target < b.Target) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  $scope.addTodo = function() {
    $scope.errormsg = "";
    if (!$scope.todo) {return;}
    if ($scope.todos.findIndex(x => x.Todo === $scope.todo) == -1) {
      if ($scope.target) {
        var formatDate = $scope.target.getFullYear() + '-'
                       + ($scope.target.getMonth() + 1) + '-'
                       + $scope.target.getDate();
        $scope.todos.push({ 
                           "Todo": $scope.todo,
                           "Priority": $scope.priority.value,
                           "Completed": false,
                           "Target": formatDate
                          });
        // Reset values
        $scope.todo = '';
        $scope.priority = $scope.options[1];
        $scope.target = new Date();
        $scope.all_todos = $scope.todos.concat($scope.done_todos);
      } else {
        $scope.errormsg = "Invalid target date";
      }
    } else {
      $scope.errormsg = "Todo already exists";
    }
  }

  $scope.removeTodo = function(x) {
    $scope.errormsg = "";
    $scope.todos.splice(x,1);
    $scope.all_todos = $scope.todos.concat($scope.done_todos);
  }

  $scope.removeDoneTodo = function(x) {
    $scope.errormsg = "";
    $scope.done_todos.splice(x,1);
    $scope.all_todos = $scope.todos.concat($scope.done_todos);
  }

  $scope.markComplete = function(x) {
    $scope.errormsg = "";
    $scope.todos[x].Completed = true;
    var today = new Date();
    var formatDate = today.getFullYear() + '-'
                   + (today.getMonth() + 1) + '-'
                   + today.getDate();
    $scope.todos[x].CompletedDate = formatDate;
    $scope.done_todos.push($scope.todos[x]);
    $scope.todos.splice(x,1);
    $scope.all_todos = $scope.todos.concat($scope.done_todos);
  }

  $scope.saveTodo = function(x) {
    $scope.errormsg = "";
    var pos = $scope.todos.findIndex(y => y.Todo === $scope.selected.Todo);
    if (pos === x || pos == -1) {
      if ($scope.selected.Target) {
        var formatDate = $scope.selected.Target.getFullYear() + '-'
                       + ($scope.selected.Target.getMonth() + 1) + '-'
                       + $scope.selected.Target.getDate();
        $scope.todos[x].Todo = $scope.selected.Todo;
        $scope.todos[x].Priority = $scope.selected.Priority.value;
        $scope.todos[x].Target = formatDate;
        $scope.all_todos = $scope.todos.concat($scope.done_todos);
      } else {
        $scope.errormsg = "Invalid target date. Edit aborted.";
      }
    } else {
      $scope.errormsg = "Todo already exists. Edit aborted.";
    }
    $scope.reset();
  }

  $scope.getTemplate = function(x) {
    if (x === $scope.selected.Index) return 'edit';
    else return 'display';
  }

  $scope.editTodo = function(x) {
    $scope.selected = angular.copy($scope.todos[x]);
    $scope.selected['Index'] = x;
    $scope.selected['Target'] = new Date(Date.parse($scope.selected['Target']));
    $scope.selected['Priority'] = $scope.options[$scope.selected['Priority']];
  }

  $scope.reset = function() {
    $scope.errormsg = "";
    $scope.selected = {};
  }
});
