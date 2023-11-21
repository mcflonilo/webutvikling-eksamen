import renderer, { act } from "react-test-renderer";
import { ShowChat } from "../showChat";
import { MoviesContext } from "../moviesContext";
import { SendChatForm } from "../sendChatForm";

describe("movies react application", () => {
  it("show loading screen", () => {
    const component = renderer.create(<ShowChat />);
    expect(component).toMatchSnapshot();
  });

  it("show loaded movies", async () => {
    const fetchMovies = () => [
      { title: "The Godfather", _id: 1 },
      { title: "The Godfather: Part II", _id: 2 },
    ];

    let component;
    await act(async () => {
      component = renderer.create(
        <MoviesContext.Provider value={{ fetchMovies }}>
          <ShowChat />
        </MoviesContext.Provider>,
      );
    });
    expect(component).toMatchSnapshot();
  });
  it("add a new movie", async () => {
    const onAddMovie = jest.fn();
    const component = renderer.create(
      <MoviesContext.Provider value={{ onAddMovie }}>
        <SendChatForm />
      </MoviesContext.Provider>,
    );

    await act(async () => {
      component.root.findByType("input").props.onChange({
        target: { value: "my test movie" },
      });
    });
    await act(async () => {
      component.root.findByType("form").props.onSubmit({
        preventDefault: () => {},
      });
    });
    expect(onAddMovie).toBeCalledWith({
      title: "my test movie",
    });
  });
});
