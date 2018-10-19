function Search(props) {

    function onKeyPressHandle(e) {
        if (e.key === 'Enter') {
            props.onKeyPress(e.target.value);
        }
    }

    return (
        <div className="search-wrap">
            <input type="text" placeholder="Search photos" ref={props.searchInputRef} onKeyPress={onKeyPressHandle} />
        </div>
    );
}

function OrderBy(props) {
    function onClickHandle(e) {
        e.preventDefault();
        props.onClickOrderBy(e.target.text);
    }

    return (
        <div className="order-by">
            <a href="#" className={props.orderBy == "popular" ? "order-by-focus" : "order-by-unfocus"}
                onClick={onClickHandle}>Popular</a>
            <a href="#" className={props.orderBy == "latest" ? "order-by-focus" : "order-by-unfocus"}
                onClick={onClickHandle}>Latest</a>
            <a href="#" className={props.orderBy == "oldest" ? "order-by-focus" : "order-by-unfocus"}
                onClick={onClickHandle}>Oldest</a>
        </div>
    );
}

function ImageElement(props) {
    const element = props.element;

    if (element !== undefined) {
        return (
            <div className="element-wrap">
                <div className="element-wrap">
                    <img className="image" src={element.urls.regular}
                        alt="" />

                    <div className="element-action">
                        <a href={element.links.download + "?force=true"}>
                            <div className="download-wrap">
                                <img className="download" src="/src/download.svg" alt="" />
                            </div>
                        </a>
                    </div>
                </div>
            </div >
        );
    }
    else {
        return null
    }
}

class MainContainer extends React.Component {
    constructor(props) {
        super(props);

        this.updateDimensions = this.updateDimensions.bind(this);
        this.onScrollHandle = this.onScrollHandle.bind(this);
        this.onClickOrderBy = this.onClickOrderBy.bind(this);
        this.requestGet = this.requestGet.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.searchInputRef = React.createRef();

        this.state = {
            orderBy: "Popular",
            page: 1,
            innerWidth: window.innerWidth,
            response: null,
            error: null,
            scrolledToBottom: false,
            search: ""
        }
    }

    componentDidMount() {
        this.searchInputRef.current.focus();
        window.addEventListener("resize", this.updateDimensions);
        window.addEventListener("scroll", this.onScrollHandle);

        const _url = "https://api.unsplash.com/photos?client_id=f7b0d91da192deaa54b98ad234eac63483c2ea6e687d63e9002cd67f3e7d47b0&per_page=20&order_by=" +
            this.state.orderBy + "&page=" + this.state.page;
        console.log(_url);

        this.requestGet(_url)
            .then(res => {
                this.setState({
                    response: res
                });
            })
            .catch(error => {
                this.setState({
                    error: error
                });
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.orderBy !== prevState.orderBy && this.state.orderBy !== "") {
            const _url = "https://api.unsplash.com/photos?client_id=f7b0d91da192deaa54b98ad234eac63483c2ea6e687d63e9002cd67f3e7d47b0&per_page=20&order_by=" +
                this.state.orderBy + "&page=" + this.state.page;
            console.log(_url);

            this.requestGet(_url)
                .then(res => {
                    this.setState({
                        response: res
                    });
                })
                .catch(error => {
                    this.setState({
                        error: error
                    });
                });
        }
        else if (this.state.scrolledToBottom !== prevState.scrolledToBottom && this.state.scrolledToBottom) {
            var _page = this.state.page + 1
            this.setState({
                page: _page,
                scrolledToBottom: false
            });

            let _url = '';

            if (this.state.search === "") {
                _url = "https://api.unsplash.com/photos?client_id=f7b0d91da192deaa54b98ad234eac63483c2ea6e687d63e9002cd67f3e7d47b0&per_page=20&order_by=" +
                    this.state.orderBy + "&page=" + _page;
            }
            else {
                _url = "https://api.unsplash.com/search/photos?client_id=f7b0d91da192deaa54b98ad234eac63483c2ea6e687d63e9002cd67f3e7d47b0&per_page=20&page=" + _page + "&query=" + this.state.search;
            }
            console.log(_url);

            this.requestGet(_url)
                .then(res => {
                    var data = null;
                    data = this.state.response;

                    if (this.state.search === "") {
                        for (let i = 0; i < res.length; i++) {
                            data.push(res[i]);
                        }
                    }
                    else {
                        for (let i = 0; i < res.results.length; i++) {
                            data.push(res.results[i]);
                        }
                    }

                    this.setState({
                        response: data
                    });
                })
                .catch(error => {
                    this.setState({
                        error: error
                    });
                });
        }
        else if (this.state.search !== prevState.search && this.state.search !== "") {
            const _url = "https://api.unsplash.com/search/photos?client_id=f7b0d91da192deaa54b98ad234eac63483c2ea6e687d63e9002cd67f3e7d47b0&per_page=20&page=" + this.state.page + "&query=" + this.state.search;
            console.log(_url);

            this.requestGet(_url)
                .then(res => {
                    this.setState({
                        response: res.results
                    });
                })
                .catch(error => {
                    this.setState({
                        error: error
                    });
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        window.removeEventListener("onscroll", this.onScrollHandle);
    }

    requestGet(_url) {
        return fetch(_url, {
            method: "GET",
            mode: "cors"
        })
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
                },
                (error) => {
                    return error;
                }
            )
    }

    updateDimensions() {
        this.setState({
            innerWidth: window.innerWidth
        });
    }

    onScrollHandle() {
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        var clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
            this.setState({
                scrolledToBottom: true
            });
        }
    }

    onClickOrderBy(value) {
        this.setState({
            orderBy: value,
            page: 1,
            search: ""
        });

        this.searchInputRef.current.value = "";
    }

    onKeyPress(value) {
        this.setState({
            search: value,
            page: 1,
            orderBy: ""
        });
    }

    render() {
        const _orderBy = this.state.orderBy.toLowerCase();
        const _innerWidth = this.state.innerWidth;

        const _response = this.state.response;
        let _left = [];
        let _between = [];
        let _right = [];

        if (_response !== null && _response !== undefined) {
            let i = 0;
            while (i < _response.length) {
                _left.push(<ImageElement key={_response[i].id} element={_response[i]} />);
                i++;

                if (i < _response.length && _innerWidth > 575.98) {
                    _between.push(<ImageElement key={_response[i].id} element={_response[i]} />);
                    i++;
                }

                if (i < _response.length && _innerWidth > 991.98) {
                    _right.push(<ImageElement key={_response[i].id} element={_response[i]} />);
                    i++
                }


            }
        }

        return (
            <div className="container">
                <Search searchInputRef={this.searchInputRef} onKeyPress={this.onKeyPress} />
                <OrderBy orderBy={_orderBy} onClickOrderBy={this.onClickOrderBy} />
                <div className="content">
                    <div className="column">
                        {_left}
                    </div>

                    {
                        (_innerWidth > 575.98)
                            ?
                            (
                                <div className="column">
                                    {_between}
                                </div>
                            )
                            :
                            (null)
                    }
                    {
                        (_innerWidth > 991.98)
                            ?
                            (
                                <div className="column">
                                    {_right}
                                </div>
                            )
                            :
                            (null)
                    }
                </div>
            </div>
        );
    }
}

ReactDOM.render(<MainContainer />, document.getElementById("main"));