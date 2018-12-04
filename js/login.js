require(["dojo/cookie", "dojo/dom", "dojo/on"], function(cookie, dom, on) {
    function compile(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
    }

    function uncompile(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    }
    // if(dom.byId("loginBtn")==null) return;
    on(dom.byId("loginBtn"), "click", function() {
        //取用户名和密码
        var u = $("#u").val(); //取输入的用户名
        var p = $("#p").val(); //取输入的密码
        //document.cookie = "user="+u;
        //document.cookie = "pwd="+p;
        if (u.length <= 0) {
            alert("用户名不能为空！");
            return;
        }
        if (p.length <= 0) {
            alert("密码不能为空！");
            return;
        } else {
            p = compile(p);
            //调ajax
            $.ajax({
                url: "Handler.ashx?method=login",
                data: {
                    "user": u,
                    "pwd": p
                }, //第二个u和p只是变量，可以随意写，里面的u和p都是第一个。
                type: "POST",
                dataType: "TEXT",
                success: function(data) { //data返回的实1或2，admin和user
                    if (data.trim() == "error") //要加上去空格，防止内容里面有空格引起错误。
                    {
                        //js跳转页面，要记住。
                        alert("用户名或密码错误");
                    } else {
                        cookie('userName', compile(u));
                        cookie('level', compile(data));
                        window.location.href = "index.html";
                    }
                },
                error: function(err) {
                    alert(err.status);
                }
            });
        }
    });
    //判断是否敲击了Enter键  
    $(document).keyup(function(event) {
        if (event.keyCode == 13) {
            $("#loginBtn").trigger("click");
        }
    });
});