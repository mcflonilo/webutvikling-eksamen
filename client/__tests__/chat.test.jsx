import { MemoryRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import { FrontPage } from "../components/chat/frontPage";
import { LoginButton } from "../components/login/loginButton";
import renderer, { act } from "react-test-renderer";
import { LoginContext } from "../components/login/loginContext";
import { MakeNewChatRoomButton } from "../components/chat/makeNewChatRoomButton";
import { EditChatRoomButton } from "../components/chat/editChatRoomButton";
import { ChatRoomSelection } from "../components/chat/chatRoomSelection";
import { loadChatRooms } from "../components/chat/showChat";
import * as showChat from "../components/chat/showChat";
import { shallow } from "enzyme";

jest.mock("../components/chat/showChat", () => {
  return {
    loadChatRooms: jest.fn(() => {
      console.log("hjeeeeeelllpo");
      return [{ roomName: "test", description: "test" }];
    }),
  };
});

describe("FrontPage", () => {
  it("makes frontpage", async () => {
    let component;
    await act(async () => {
      component = renderer.create(
        <MemoryRouter initialEntries={["/"]}>
          <FrontPage />,
        </MemoryRouter>,
      );
    });
    expect(component).toMatchSnapshot();
    expect(
      component.root.findAllByType("p").map((c) => c.children.join(" ")),
    ).toEqual([
      "To get started, you have to log in, you can just use a username to chat. But if you want to create a chatroom, you have to log in with google.",
    ]);
  });

  it("makes button if username is not null", () => {
    const fetchUser = jest.fn();
    const user = { name: "test" };
    const domElement = document.createElement("div");
    ReactDOM.render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginContext.Provider value={{ fetchUser, user, username: user.name }}>
          <LoginButton />
        </LoginContext.Provider>
      </MemoryRouter>,
      domElement,
    );
    expect(domElement.innerHTML).toMatchSnapshot();
    expect(domElement.innerHTML).toEqual('<a href="/profile">test</a>');
  });

  it("makes button if user is valid", () => {
    const user = { email_verified: true, name: "test" };
    const domElement = document.createElement("div");
    ReactDOM.render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginContext.Provider value={{ user }}>
          <MakeNewChatRoomButton />
        </LoginContext.Provider>
      </MemoryRouter>,
      domElement,
    );
    expect(domElement.innerHTML).toMatchSnapshot();
    expect(domElement.innerHTML).toEqual(
      '<a href="/chatroom/create">Make new chatroom!</a>',
    );
  });

  it("makes button if user and room is valid", () => {
    const user = { email_verified: true, name: "test" };
    const room = { user: user, roomName: "test" };
    const domElement = document.createElement("div");
    ReactDOM.render(
      <MemoryRouter initialEntries={["/"]}>
        <LoginContext.Provider value={{ user }}>
          <EditChatRoomButton room={room} />
        </LoginContext.Provider>
      </MemoryRouter>,
      domElement,
    );
    expect(domElement.innerHTML).toMatchSnapshot();
    expect(domElement.innerHTML).toEqual(
      '<a href="/chatroom/edit?roomName=test"><i class="fas fa-edit">✎</i></a>',
    );
  });
});
