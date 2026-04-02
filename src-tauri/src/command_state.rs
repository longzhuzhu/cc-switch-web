use std::ops::Deref;

pub struct State<'a, T: ?Sized> {
    inner: &'a T,
}

impl<'a, T: ?Sized> State<'a, T> {
    pub fn new(inner: &'a T) -> Self {
        Self { inner }
    }

    pub fn inner(&self) -> &'a T {
        self.inner
    }
}

impl<'a, T: ?Sized> Copy for State<'a, T> {}

impl<'a, T: ?Sized> Clone for State<'a, T> {
    fn clone(&self) -> Self {
        *self
    }
}

impl<'a, T: ?Sized> Deref for State<'a, T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        self.inner
    }
}
